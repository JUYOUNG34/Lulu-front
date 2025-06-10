import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Mappin from "../../assets/images/PetMeeting/map-pin.svg";
import myLocation from "../../assets/images/PetMeeting/myLocation.png";
import { Context } from "../../context/Context.jsx";

const KakaoMap = ({ address, setAddress, setDongName, setLatitude, setLongitude }) => {
    const { showModal, user } = useContext(Context);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const searchKeyword = useRef("");
    const [sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
            setSdkLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    console.log("✅ 카카오 맵 SDK 로드 완료");
                    setSdkLoaded(true);
                });
            }
        };

        script.onerror = () => {
            console.error("❌ 카카오 맵 SDK 로드 실패");
            showModal("지도 오류", "지도를 불러올 수 없습니다. 새로고침 후 다시 시도해주세요.");
        };

        document.head.appendChild(script);

        return () => {
            const scriptToRemove = document.querySelector('script[src*="dapi.kakao.com"]');
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (!sdkLoaded || !mapRef.current) return;

        console.log("🗺️ 지도 초기화 시작");

        const initMap = (center) => {
            try {
                const options = {
                    center,
                    level: 3,
                };

                const map = new window.kakao.maps.Map(mapRef.current, options);
                mapInstanceRef.current = map;

                window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    placeMarker(latlng.getLat(), latlng.getLng());
                });

                console.log("✅ 지도 초기화 완료");
            } catch (error) {
                console.error("❌ 지도 초기화 실패:", error);
                showModal("지도 오류", "지도를 초기화할 수 없습니다.");
            }
        };

        if (user?.latitude && user?.longitude) {
            console.log("📍 사용자 저장 위치 사용:", user.latitude, user.longitude);
            const center = new window.kakao.maps.LatLng(user.latitude, user.longitude);
            initMap(center);
            placeMarker(user.latitude, user.longitude);
        } else {
            // 현재 위치 가져오기
            if (navigator.geolocation) {
                console.log("📍 현재 위치 요청 중...");
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        console.log("✅ 현재 위치 획득:", latitude, longitude);
                        const center = new window.kakao.maps.LatLng(latitude, longitude);
                        initMap(center);
                        placeMarker(latitude, longitude);
                    },
                    (error) => {
                        console.warn("⚠️ 위치 권한 거부 또는 실패:", error.message);
                        // 기본 위치 (서울 시청)
                        const fallback = new window.kakao.maps.LatLng(37.5665, 126.978);
                        initMap(fallback);
                        showModal(
                            "위치 정보",
                            "위치 권한이 거부되어 서울 시청으로 설정됩니다. 지도를 클릭하여 위치를 선택해주세요."
                        );
                    },
                    {
                        timeout: 10000, // 10초로 연장
                        enableHighAccuracy: true,
                        maximumAge: 300000, // 5분 캐시
                    }
                );
            } else {
                console.warn("⚠️ 지오로케이션 미지원");
                const fallback = new window.kakao.maps.LatLng(37.5665, 126.978);
                initMap(fallback);
            }
        }
    }, [sdkLoaded, user]);

    const searchAndMove = () => {
        const keyword = searchKeyword.current.trim();
        if (!keyword) {
            showModal("검색", "검색어를 입력해주세요.");
            return;
        }

        console.log("🔍 장소 검색:", keyword);

        try {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                    const first = data[0];
                    const lat = parseFloat(first.y);
                    const lng = parseFloat(first.x);
                    console.log("✅ 검색 결과:", first.place_name, lat, lng);

                    const newPos = new window.kakao.maps.LatLng(lat, lng);
                    mapInstanceRef.current.setCenter(newPos);
                    placeMarker(lat, lng);
                } else {
                    console.warn("⚠️ 검색 결과 없음");
                    showModal("검색 결과", `"${keyword}"에 대한 검색 결과가 없습니다.`);
                }
            });
        } catch (error) {
            console.error("❌ 검색 실패:", error);
            showModal("검색 오류", "검색 중 오류가 발생했습니다.");
        }
    };

    const placeMarker = (lat, lng) => {
        const map = mapInstanceRef.current;
        if (!map) {
            console.error("❌ 지도 인스턴스가 없습니다");
            return;
        }

        try {
            // 기존 마커 제거
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            // 새 마커 생성
            const pos = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
                position: pos,
                map: map,
            });
            markerRef.current = marker;

            console.log("📍 마커 설정:", lat, lng);

            setTimeout(() => {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.coord2Address(lng, lat, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK && result[0]) {
                        const addr = result[0].address.address_name;
                        const dong = result[0].address.region_3depth_name;
                        console.log("📍 주소 변환:", addr, dong);

                        setAddress(addr);
                        setDongName(dong);
                        setLatitude(lat);
                        setLongitude(lng);
                    } else {
                        console.warn("⚠️ 주소 변환 실패");
                        setLatitude(lat);
                        setLongitude(lng);
                    }
                });
            }, 200);
        } catch (error) {
            console.error("❌ 마커 설정 실패:", error);
        }
    };

    const currentCenter = () => {
        if (!navigator.geolocation) {
            showModal("위치 정보", "이 브라우저는 위치 서비스를 지원하지 않습니다.");
            return;
        }

        console.log("📍 현재 위치로 이동 요청");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                console.log("✅ 현재 위치:", lat, lng);

                const center = new window.kakao.maps.LatLng(lat, lng);
                mapInstanceRef.current.panTo(center);
                placeMarker(lat, lng);
            },
            (error) => {
                console.error("❌ 현재 위치 획득 실패:", error);
                let errorMessage = "현재 위치를 가져올 수 없습니다.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "위치 정보를 사용할 수 없습니다.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "위치 요청 시간이 초과되었습니다.";
                        break;
                }

                showModal("위치 오류", errorMessage);
            },
            {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 60000,
            }
        );
    };

    if (!sdkLoaded) {
        return (
            <Box>
                <Box
                    sx={{
                        width: "100%",
                        height: "350px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" color="textSecondary">
                        🗺️ 지도를 불러오는 중...
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        잠시만 기다려주세요
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px", position: "relative" }}>
                <Box
                    onClick={currentCenter}
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        zIndex: 9999,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    <Box component="img" src={myLocation} sx={{ width: "20px", height: "20px" }} />
                </Box>
            </div>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ddd",
                        borderRadius: "30px",
                        px: 2,
                        py: 0.5,
                        width: "90%",
                        m: 2,
                        justifyContent: "space-between",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <SearchIcon sx={{ color: "#000", mr: 1 }} />
                        <InputBase
                            placeholder="장소 검색 (예: 강남역, 롯데타워)"
                            sx={{ color: "black", flex: 1 }}
                            onKeyDown={(e) => e.key === "Enter" && searchAndMove()}
                            onChange={(e) => (searchKeyword.current = e.target.value)}
                        />
                        <Button
                            onClick={searchAndMove}
                            sx={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                borderRadius: "30px",
                                backgroundColor: "#E9A260",
                                color: "white",
                                px: 2,
                                minWidth: "unset",
                                width: "80px",
                                height: "100%",
                                "&:hover": {
                                    backgroundColor: "#d89248",
                                },
                            }}
                        >
                            검색
                        </Button>
                    </Box>
                </Box>
            </Box>

            {address && (
                <Box sx={{ display: "flex", m: "0 16px 16px 16px", alignItems: "center" }}>
                    <Box component="img" src={Mappin} sx={{ mr: 1 }} />
                    <Typography sx={{ fontSize: "16px", color: "#333" }}>{address}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default KakaoMap;
