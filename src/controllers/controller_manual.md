## controller


- controller 함수(a.k.a. request handler)들을 모아놓은 객체
- Presentation layer에 속하며, 바로 밑에 계층인 Business layer에 있는 service 객체를 불러서 비즈니스 로직을 수행하게 한다.
- input 검증, 방어, 기타 비즈니스 로직이 수행되기 전에 진행되어야할 로직들을 수행한다. 물론 이 부분은 별도의 middleware로 분리하는 경우가 많다.
- 보통은 request에서 매개변수들(params, query, body, headers)을 꺼내서 service 객체에게 넘겨주는 작업만을 수행한다(검증 부분은 미들웨어가 하기 때문에).
- 그리고 service 객체에게로 부터 반환받은 값(DTO)을 최종적으로 client에게 응답으로 보내주는 역할을 담당한다.
-  때로는 응답을 보내기전 응답에 담을 데이터를 한 번 검증하고 보내는 경우도 많다.

```
const postController = {
  // HTTP Post를 위한 controller(request handler)
  async postPost(req, res, next) {
    try {
      // POST는 HTTP body를 사용하기 때문에 body에서 필요한 데이터를 추출
      const { title, content, author } = req.body;
      // 추출한 데이터를 postService.createPost로 전달
      const post = await postService.createPost({ title, content, author });
      // postService.createPost의 결과물로 반환받은 데이터를 응답에 담아 보낸다.
      // utils.buildResponse 함수는 일관된 응답({ data: <결과값>, error: <에러 메시지가 있다면> })을 보내기위한 보조 함수
      res.status(201).json(utils.buildResponse(post));
    } catch (error) {
      // service에서 에러가 발생하면 try/catch문으로 잡아서 next 함수로 에러를 중앙 error handler에게 전달
      next(error);
    }
  },
}
```

출처: 한인호 코치님 0919 board api