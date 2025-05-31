export const checkLogin = async () => {
    try {
        console.log("🔄 checkLogin: API 호출 시작");
        // instance 대신 정확한 axiosInstance 사용
        const response = await axiosInstance.get('/auth/check');
        
        console.log("✅ checkLogin: API 응답 받음", response);
        console.log("📊 응답 데이터:", response.data);
        
        if (response && response.data) {
            const { message, data } = response.data; // CustomResponse에서 message와 data 분리
            console.log("✅ checkLogin: 데이터 파싱 성공", data);
            return data; // 필요한 데이터를 반환
        }
        console.log("⚠️ checkLogin: 응답 없음");
        return null; // 응답이 없으면 null 반환
    } catch (error) {
        console.error("❌ checkLogin: API 호출 실패", error);
        if (error.response) {
            console.error("❌ 응답 상태:", error.response.status);
            console.error("❌ 응답 데이터:", error.response.data);
        }
        throw error;
    }
};
