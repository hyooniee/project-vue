import axios from "axios";
import { Resume } from "../../api";

export const resumeDetailUpdateApi = async (resIdx, resume, fileData) => {
  const formData = new FormData();

  // Spring컨트롤러에서 MultiPart방식이 아니라 MultipartHttpServletRequest방식으로 보내고 있어서 그에 맞게 수정
  const textData = {
    resIdx: resIdx,
    res_title: resume.resTitle,
    short_intro: resume.shortIntro,
    pfo_link: resume.pfoLink,
    per_statement: resume.perStatement,
  };

  Object.entries(textData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (fileData.value) formData.append("resumeAttach", fileData.value);

  const result = await axios.post(Resume.UpdateResumeDetail, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
};