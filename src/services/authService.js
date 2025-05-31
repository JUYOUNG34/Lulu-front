import axiosInstance from "./axiosInstance.js";

const API_URL = "/auth"; // 상대 URL

export const logout = async () => {
    try {
        const response = await axiosInstance.post(`${API_URL}/logout`);
        return response.data; // 성공적인 응답 반환
    } catch (error) {
        console.error("로그아웃 실패", error);
        throw error; // 예외를 다시 던져서 호출한 곳에서 처리하도록 함
    }
};

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/userinfo`);
        if (response && response.data) {
            const { message, data } = response.data; // CustomResponse에서 message와 data 분리
            return data; // 필요한 데이터를 반환
        }
        return null; // 응답이 없으면 null 반환
    } catch (error) {
        console.error("유저정보 로딩 실패", error);
        throw error; // 오류를 다시 던져서 호출한 쪽에서 처리하도록 함
    }
};

export const checkLogin = async () => {
    try {
        console.log("🔄 checkLogin: API 호출 시작");
        const response = await axiosInstance.get("/auth/check");
        
        console.log("✅ checkLogin: API 응답 받음", response);
        console.log("📊 응답 데이터:", response.data);
        
        if (response && response.data) {
            const { message, data } = response.data;
            console.log("✅ checkLogin: 데이터 파싱 성공", data);
            return data;
        }
        console.log("⚠️ checkLogin: 응답 없음");
        return null;
    } catch (error) {
        console.error("❌ checkLogin: API 호출 실패", error);
        if (error.response) {
            console.error("❌ 응답 상태:", error.response.status);
            console.error("❌ 응답 데이터:", error.response.data);
        }
        throw error;
    }
};

export const checkNickname = async (nickname) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/check-nickname?nickname=${nickname}`);
        if (response && response.data) {
            const { message, data } = response.data; // CustomResponse에서 message와 data 분리
            return data; // 필요한 데이터만 반환
        }
        return null; // 응답이 없으면 null 반환
    } catch (error) {
        console.error("닉네임 중복 확인 중 오류:", error);
        throw error; // 예외를 호출한 곳에서 처리하도록 던짐
    }
};

export const saveOrUpdateFcmToken = async ({ userId, fcmToken, mobile, dev }) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/fcm`, {
            userId,
            fcmToken,
            mobile, // 모바일 여부 추가
            dev, // 개발 환경 여부 추가
        });
        return true;
    } catch (error) {
        console.error("❌ FCM 토큰 등록 실패:", error);
        throw error;
    }
};

// API 호출
export const registration = async (formData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/register`, formData);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패", error);
        throw error;
    }
};
