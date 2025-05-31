import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import { checkLogin, getUserInfo } from "../../services/authService.js";
import * as ncloudchat from "ncloudchat";

const OAuth2Success = () => {
    const { setUser, setLogin, nc, setNc } = useContext(Context);
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        (async () => {
            console.log("🔄 OAuth2Success: checkLogin 시작");

            try {
                const data = await checkLogin();
                console.log("✅ checkLogin 응답:", data);

                if (!data) {
                    console.error("🚨 로그인 체크 실패 - data가 null/undefined");
                    navigate("/login", { replace: true });
                    return;
                }

                console.log("📊 사용자 정보:", {
                    isNewUser: data.isNewUser,
                    userId: data.userId,
                    snsAccountId: data.snsAccountId
                });

                if (data.isNewUser) {
                    console.log("🆕 신규 유저 감지 → /register로 이동");
                    navigate("/register", { replace: true });
                } else {
                    console.log("👤 기존 유저 → 유저 정보 가져오기");
                    try {
                        const userData = await getUserInfo();
                        console.log("✅ 유저 정보 가져오기 성공:", userData);

                        setUser({
                            id: userData.id,
                            nickname: userData.nickname,
                            path: userData.path,
                            address: userData.address,
                            dongName: userData.dongName,
                            latitude: userData.latitude,
                            longitude: userData.longitude,
                            distance: userData.distance,
                            chatId: "ncid" + userData.id,
                        });
                        setLogin(true);

                        if (!nc) {
                            const chat = new ncloudchat.Chat();
                            await chat.initialize(import.meta.env.VITE_NCLOUD_CHAT_PROJECT_ID);
                            await chat.connect({
                                id: "ncid" + String(userData.id),
                                name: userData.nickname,
                                profile: userData.path,
                                language: "ko",
                            });
                            setNc(chat);
                        }

                        console.log("✅ 메인 페이지로 이동");
                        navigate("/", { replace: true });
                    } catch (e) {
                        console.error("❌ 유저 정보 가져오기 실패:", e);
                        navigate("/login", { replace: true });
                    }
                }
            } catch (error) {
                console.error("❌ OAuth2Success 전체 오류:", error);
                navigate("/login", { replace: true });
            }
        })();
    }, [navigate, setUser, setLogin, nc, setNc]);

    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>로그인 처리 중입니다...</h2>
          <p>잠시만 기다려 주세요...</p>
      </div>
    );
};

export default OAuth2Success;