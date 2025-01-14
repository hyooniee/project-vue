<template>
  <div>
    <ContextBox>{{
      !detailValue.faq_idx ? "FAQ 등록" : "FAQ 상세보기"
    }}</ContextBox>
  </div>
  <div class="board-detail">
    <div class="board-contents">
      <table style="width: 100%; margin-top: 10%">
        <tr>
          <td>유형</td>
          <td>
            <input
              type="radio"
              id="individual"
              value="1"
              v-model="detailValue.faq_type"
              style="width: 20px"
            />
            개인회원

            <input
              type="radio"
              id="company"
              value="2"
              v-model="detailValue.faq_type"
              style="width: 20px"
            />
            기업회원
          </td>
        </tr>
        <tr>
          <td>제목</td>
          <td>
            <input
              type="text"
              v-model="detailValue.title"
              style="width: 100%"
            />
          </td>
        </tr>
        <tr>
          <td>내용</td>
          <td>
            <textarea
              style="width: 100%; border: 1px solid #ccc"
              v-model="detailValue.content"
              rows="5"
            />
          </td>
        </tr>
      </table>
      <div class="button-box" v-if="userType === 'M'">
        <button @click="actionHandler">
          {{ actionLabel }}
        </button>
        <button v-if="detailValue.faq_idx" @click="handleDelete">삭제</button>
        <button @click="$router.go(-1)">뒤로가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "@/common/toastMessage";
import { computed, ref, watchEffect } from "vue";
import { useFAQDetailDelete } from "../../../hook/faq/useFAQDetailDelete";
import { useFAQDetailInsert } from "../../../hook/faq/useFAQDetailInsert";
import { useFAQDetailSearch } from "../../../hook/faq/useFAQDetailSearch";
import { useFAQDetailUpdate } from "../../../hook/faq/useFAQDetailUpdate";
import { useUserInfo } from "../../../stores/userInfo";

const userInfo = useUserInfo();
const userType = computed(() => userInfo.user.userType);
const faq_idx = ref("");
const detailValue = ref({
  faq_type: "1",
  title: "",
  content: "",
});

const {
  data: FAQDetail,
  isSuccess,
  refetch,
} = useFAQDetailSearch(detailValue, faq_idx);

watchEffect(() => {
  if (isSuccess && FAQDetail.value && faq_idx) {
    detailValue.value = { ...FAQDetail.value.detail };
    //detailValue.value.faq_type = FAQDetail.value.detail.faq_type;
  }
});

const actionLabel = computed(() =>
  faq_idx.value === "faqSavePart.do" ? "등록" : "수정"
);

const { mutate: handlerUpdateBtn } = useFAQDetailUpdate(detailValue, faq_idx);

const { mutate: handlerInsertBtn } = useFAQDetailInsert(
  detailValue,
  faq_idx,
  userInfo.user.loginId
);

const { mutate: handlerDeleteBtn } = useFAQDetailDelete(faq_idx);

const validateInputs = () => {
  if (!detailValue.value.faq_type) {
    toast.error("회원유형을 선택해주세요.");
    return false;
  }
  if (!detailValue.value.title) {
    toast.error("제목을 입력해주세요.");
    return false;
  }
  if (!detailValue.value.content) {
    toast.error("내용을 입력해주세요.");
    return false;
  }
  return true;
};

const actionHandler = () => {
  if (!validateInputs()) return;

  if (faq_idx.value === "faqSavePart.do") {
    if (confirm("등록하시겠습니까?")) {
      handlerInsertBtn();
    }
  } else {
    if (confirm("수정하시겠습니까?")) {
      handlerUpdateBtn();
    }
  }
};

const handleDelete = () => {
  if (confirm("삭제하시겠습니까?")) {
    handlerDeleteBtn();
  }
};

//신규등록 버튼을 눌렀을때
onActivated(() => {
  let pathSegments = window.location.pathname.split("/"); // URL을 '/'로 분리
  faq_idx.value = pathSegments[pathSegments.length - 1]; // 맨 끝 값 추출
  if (faq_idx.value === "faqSavePart.do") {
    detailValue.value.title = "";
    detailValue.value.content = "";
  }
});
</script>

<style lang="scss" scoped>
.backdrop {
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-flow: row wrep;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  font-weight: bold;
}

label {
  display: flex;
  flex-direction: column;
}

input[type="text"] {
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  position: relative;
  width: 400px;
}

.button-box {
  text-align: right;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
button {
  background-color: #3bb2ea;
  border: none;
  color: white;
  padding: 10px 22px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px #999;
  transition: 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3e8e41;
    box-shadow: 0 2px #666;
    transform: translateY(2px);
  }
}
</style>
