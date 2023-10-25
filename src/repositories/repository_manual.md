## Repository or DAO


- 직접적으로 DB와 통신을 담당하는 객체의 클래스. DAO: Data Access Object
- Persistence layer에 속하며, 바로 위 계층인 Business layer에 속하는 service 객체와 소통(서비스 객체가 DAO객체를 호출)을 한다.
- DAO 객체는 자신이 어떤 DB와 데이터를 주고 받는지를 인지하고 있다. 데이터 송수신 총 책임자 역할이다. 레스토랑에서 "재료 조달 관리자"와 같은 위치.
- DAO 객체 덕분에 service 객체는 본인이 "어떤 DB에서 데이터를 CRUD하는지" 알 필요가 없어졌다. 해당 내용은 모두 DAO가 담당하기 때문에 service 객체는 DAO가 제공해주는 메소드를 활용해서 필요한 데이터를 다루면 된다.
- 레스토랑의 비유를 들자면 service 객체는 쉐프, DAO 객체는 조달처로부터 재료를 조달하고 관리하는 "재료 조달 관리자". 쉐프는 재료 관리자를 믿고 제공된 재료로 요리를 하고 재료 관리자는 책임지고 양질의 재료를 가져온다.

- 출처: 한인호 코치님 0919 board_api
```
class PostDAO {
  // 새로운 게시글 document 객체를 생성하여 mongoDB에 저장하는 메소드
  async create({ title, content, author }) {
    // 모델 클래스로 게시글 document 객체를 생성하고
    const post = new Post({ title, content, author });
    // 모델 객체의 save 메소드를 호출하여 게시글의 요소(title, content, author)들을 검증하고 저장. 검증하는 과정 중 문제가 있으면 에러 발생.
    await post.save();
    // post 객체는 값만 있는 객체가 아닌 메소드까지 포함한 non-POJO 객체이다. toObject를 이용해서 POJO로 바꿔주자.
    return post.toObject();
  }
  // 특정 id를 _id로 갖는 게시글 document 객체를 찾아오는 메소드
  async findById(id) {
    // 쿼리 메소드 마지막에 lean 메소드를 불러주면(chaining해주면) POJO 객체를 리턴해준다.
    // 일반적으로 find*형식의 쿼리를 하면 mongoose의 내부 클래스인 Document class(구 HydratedDocument class)의 객체로 쿼리 결과들을 변환해서 반환을 해주는데
    // 이 작업이 상대적으로 시간을 소모하는 작업이기 때문에 확실하게 Document class 필요하지 않으면 lean을 호출하는 것이 성능상 좋다.
    // 반대로 lean을 사용하게 되면 몇 가지 기능이 유실되는데 다음 링크를 참고하자: 링크{@link https://mongoosejs.com/docs/tutorials/lean.html}
    const plainPost = await Post.findById(id).lean();
    const plainComments = await Comment.find({
      postId: id,
    }).lean();

    // 게시글과 댓글을 합쳐줌
    plainPost.comments = plainComments;

    // POJO 객체로된 단일 객체를 반환
    return plainPost;
  }
  // 특정 조건({ title, author })에 맞는 복수의 게시글 document 객체를 찾아오는 메소드
  // filter는 일반 JS 객체로 mongoose의 모델 객체의 find 메소드를 부를 때 사용하는 조건 필터링용 객체이다.
  async findMany({ title, author }) {
    // utils.sanitizeObject함수를 사용해서 filter 객체 내부에 undefined로 할당 되어있는 값들을 다 없애준다(데이터 클렌징).
    // e.g. utils.sanitizeObject({ a: undefined, b: 1 })의 결과는 { b: 1 }이다.
    // 이 함수는 의도하지 않았거나 예상하지 못한 조건을 없애기 위해 사용한다.
    const sanitizedFilter = utils.sanitizeObject({
      title,
      author,
    });
    // 정리가된 필터 조건으로 mongoDB로 부터 게시글 document 객체들을 가져오며 이번에도 lean을 사용해서 POJO 형식(+배열에 담긴 형태)으로 가져온다.
    const plainPosts = await Post.find(sanitizedFilter).lean();

    const plainComments = await Comment.find({
      postId: { $in: plainPosts.map((post) => post._id) },
    }).lean();

    const postIdToCommentsMap = plainComments.reduce((map, comment) => {
      const { postId } = comment;
      if (map[postId] === undefined) {
        map[postId] = [comment];
        return map;
      }
      map[postId].push(comment);
      return map;
    }, {});

    const completePosts = plainPosts.map((post) => {
      post.comments = postIdToCommentsMap[post._id] ?? []; // 만약 댓글이 없다면 빈 배열F
      return post;
    });

    return completePosts;
  }
  // 특정 id를 _id로 갖고 있는 게시글 document를 toUpdate 객체의 내용으로 덮어 씌운다(overwrite).
  // 덮어 씌우는 것이기 때문에 잘못된 값이 의도치 않게 들어가면 문제가 발생할 수 있다.
  // 그렇기 때문에 사전에 utils.sanitizeObject로 데이터 클렌징을 한 번 해준다.
  // NOTE: 만약 toUpdate에 { title: undefined, author: undefined }라는 값이 들어오면 기존의 게시글 document는 타이틀과 게시글 작성자가 없는 글이 될 가능성이 있다!
  async updateOne(id, { title, author }) {
    const sanitizedToUpdate = utils.sanitizeObject({
      title,
      author,
    });
    // 해당 id를 갖는 게시글 document를 먼저 찾고 있으면 업데이트하는 메소드
    // "하나"의 document를 업데이트하며,
    // updateOne 메소드와의 차이점은 이 메소드는 document 객체(기본적으로 업데이트 전의 document)를 리턴하는 반면
    // updateOne 메소드는 아래와 같은 값들을 리턴한다:
    // - matchedCount
    // - modifiedCount
    // - acknowledged
    // - upsertedId
    // - upsertedCount
    // 업데이트 후 바로 document 객체가 필요하다면 findByIdAndUpdate가 사용하기 편하다.
    const plainUpdatedPost = await Post.findByIdAndUpdate(
      id, // document의 id이며 이는 곧 mongoDB에 저장된 _id에 저장된 값이다.
      sanitizedToUpdate, // update할 객체의 모습, 원래 update는 { $set: { title: 'some-title', author: 'someone' } } 이런식으로 $set을 명시해줘야하지만 여기서는 생략해줘도 된다
      {
        runValidators: true, // 기본적으로 findOneAnd*의 형식의 메소드들은 schema 체크를 안한다. 이 옵션을 true로 해주면 schema 체크(업데이트 될 데이터에 대한 검증)를 진행한다.
        new: true, // 기본적으로 findOneAnd*의 형식의 메소드들은 업데이트 전의 document를 리턴한다. 업데이트 후의 document를 리턴받기 위해서는 이 옵션을 true로 해주면 된다.
      }
    ).lean(); // 여기서도 lean을 사용하여 POJO를 리턴 받자.
    return plainUpdatedPost;
  }
  // 특정 id를 _id로 갖고 있는 게시글 document를 삭제한다(hard delete).
  async deleteOne(id) {
    // 게시글과 연결된 댓글 그리고 게시글 자체를 삭제
    const [plainDeletedPost] = await Promise.all(
      // 위의 findByIdAndUpdate와 비슷하지만 update가 아니라 delete를 하며, 삭제된 document 객체를 반환한다.
      Post.findByIdAndDelete(id).lean(), // 여기서도 lean을 사용하여 POJO를 리턴 받자.
      Comment.deleteMany({ postId: id })
    );

    // 사실 위의 두 가지 작업은 같이 성공해야하거나 실패해야함. 데이터의 일관성을 위한 것이며 부분적으로만 성공하면 나중에 삭제하기가 어려워진다.
    // 이런 경우에는 mongoose의 transaction을 사용해보자!

    return plainDeletedPost;
  }
}

module.exports = new PostDAO();
```
