import multer from "multer";

// 로컬 저장소 구성
const localStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/"); // 파일이 저장될 서버 상의 위치
  },
  filename: function (req, file, callback) {
    // 파일 이름을 원본 파일 이름과 업로드 시간으로 구성
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

// 로컬 업로드 미들웨어 초기화
export const uploadLocal = multer({ storage: localStorage });
