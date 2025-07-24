import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 웨딩 청첩장 생성을 위한 시스템 프롬프트
const WEDDING_SYSTEM_PROMPT = `
당신은 전문적인 웨딩 청첩장 데이터 생성 전문가입니다.
사용자가 제공한 조건에 맞춰 완성된 웨딩 청첩장 데이터를 생성해주세요.

## 작성 가이드라인:
1. 선택된 분위기와 스타일에 맞는 톤앤매너로 문구 작성
2. 대상 연령층을 고려한 적절한 언어 사용
3. 계절감과 색상 테마를 자연스럽게 반영
4. 레이아웃 구성에 맞는 문단 구조 제안
5. 요청된 텍스트 길이에 맞게 조절
6. 한국의 전통적인 혼례 예절과 현대적 감성을 조화
7. 신랑신부의 마음이 잘 전달되는 따뜻한 문구
8. 모바일 화면이니 텍스트를 10자 이하씩 줄바꿈 해서 어울리는 멘트로 작성할 것
9. 줄바꿈은 {enter} 말고 \n 으로 작성할 것

## 응답 형식:
다음과 같은 완전한 웨딩 데이터 JSON 형태로 응답해주세요:
**
{
  "pages": {
    "coverDesign": {
      "enabled": true,
      "order": 0,
      "image": "",
      "text": "감동적인 커버 문구  (저희의 결혼식에 초대합니다.)",
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff"
    },
    "introMessage": {
      "enabled": true,
      "order": 1,
      "title": "모시는 글",
      "text": "선택된 조건에 맞는 감동적인 모시는 글을 작성 (서로에게 가장 편안한 사람이 되어\n함께 살아가기로 했습니다.\n새롭게 시작하는\n저희 두 사람의 앞날을\n함께 축복해주시면\n더없이 감사하겠습니다.) ",
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff",
      "image": {
        "position": "top",
        "url": ""
      }
    },
    "familyInfo": {
      "enabled": true,
      "order": 2,
      "telEnabled": true,
      "accountEnabled": true,
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff",
      "fontColor": "#000000"
    },
    "calendar": {
      "enabled": true,
      "order": 3,
      "view": {
        "calendar": true,
        "countdown": true,
        "dDay": true
      },
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff"
    },
    "gallery": {
      "enabled": true,
      "order": 4,
      "images": [],
      "displayType": "stacked",
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff"
    },
    "mapDirections": {
      "enabled": true,
      "order": 5,
      "kakaoMap": true,
      "naverMap": true,
      "tmap": true,
      "googleMap": true,
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff",
      "naviInfo": {
        "enabled": false,
        "text": ""
      },
      "busInfo": {
        "enabled": false,
        "text": ""
      },
      "subwayInfo": {
        "enabled": false,
        "text": ""
      },
      "parkingInfo": {
        "enabled": false,
        "text": ""
      },
      "etcInfo": {
        "enabled": false,
        "text": ""
      }
    },
    "accountInfo": {
      "enabled": true,
      "order": 6,
      "title": "마음 전하실 곳",
      "description": "조건에 맞는 계좌 안내 문구 작성 계좌번호 표기 X, 최대한 정중하게",
      "kakaopayLink": "",
      "backgroundColor": "#ffffff",
      "backgroundColor2": "#f0f8ff"
    },
    "endingMessage": {
      "enabled": true,
      "order": 7,
      "text": "선택된 조건에 맞는 마무리 인사말 작성",
      "image": {
        "position": "top",
        "url": ""
      }
    }
  },
}
  **

## 주의사항:
- 색상 테마에 맞게 backgroundColor, backgroundColor2 조정
- 분위기와 스타일에 맞는 문구 작성
- 모든 필드를 빠짐없이 포함하여 완전한 JSON 응답
- 이미지의 url은 모두 ""로 작성
`;

const generateWeddingContent = async (req: NextRequest) => {
  try {
    // OpenAI API 키 검증
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API 키가 설정되지 않았습니다.");
      return NextResponse.json(
        {
          error:
            "AI 서비스 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.",
          details: "OpenAI API 키가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    const {
      mood,
      target,
      season,
      style,
      color,
      textLength,
      additionalRequirements,
    } = await req.json();

    console.log("웨딩 청첩장 데이터 생성 요청:", {
      mood,
      target,
      season,
      style,
      textLength,
    });

    // 사용자 프롬프트 구성
    const userPrompt = `
다음 조건에 맞는 완전한 웨딩 청첩장 데이터를 생성해주세요:

**스타일 조건:**
- 분위기: ${mood} || "따뜻한 분위기"}
- 대상 연령층: ${target || "전체 연령층"}
- 계절 테마: ${season || "계절 무관"}
- 디자인 스타일: ${style || "모던"}
- 색상 테마: ${color || "화이트 계열"}
- 텍스트 길이: ${textLength || "적당  한 길이로"}

**추가 요구사항:**
${additionalRequirements || "특별한 요구사항 없음"}

위 조건들을 모두 고려하여 완전한 웨딩 청첩장 데이터 구조를 JSON 형태로 생성해주세요.
특히 다음 항목들에 집중해주세요:
1. coverDesign.text - 감동적인 커버 문구 ()
2. introMessage.text - 조건에 맞는 모시는 글
3. accountInfo.description - 계좌 안내 문구
4. endingMessage.text - 마무리 인사말
5. 색상 테마에 맞는 backgroundColor, backgroundColor2
`;

    // OpenAI API 호출
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: WEDDING_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    console.log("OpenAI API 호출 시작");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.8, // 창의성을 위해 조금 높게 설정
        stream: false,
      });

      console.log("OpenAI 응답 받음");

      if (!response.choices || response.choices.length === 0) {
        throw new Error("AI 응답을 받지 못했습니다.");
      }

      const aiMessage = response.choices[0].message?.content;
      if (!aiMessage) {
        throw new Error("AI 메시지 내용을 받지 못했습니다.");
      }

      // 마크다운 코드 블록 제거 및 JSON 추출
      let jsonString = aiMessage.trim();

      // ```json ... ``` 형태의 코드 블록 제거
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // JSON 객체 시작과 끝 찾기
      const jsonStart = jsonString.indexOf("{");
      const jsonEnd = jsonString.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }

      // 앞뒤 공백 제거
      jsonString = jsonString.trim();

      console.log("정제된 JSON 문자열:", jsonString.substring(0, 200) + "...");

      // JSON 응답 파싱 시도
      let generatedContent;
      try {
        generatedContent = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("JSON 파싱 실패:", parseError);
        console.error("원본 AI 응답:", aiMessage);
        console.error("정제된 JSON 문자열:", jsonString);
        return NextResponse.json(
          {
            error: "AI 응답을 올바른 JSON 형식으로 파싱할 수 없습니다.",
            details: jsonString.substring(0, 500) + "...",
            originalResponse: aiMessage.substring(0, 300) + "...",
            parseError:
              parseError instanceof Error
                ? parseError.message
                : String(parseError),
          },
          { status: 500 }
        );
      }

      // 응답 반환
      return NextResponse.json({
        success: true,
        message: "웨딩 청첩장 데이터 생성 완료",
        weddingData: generatedContent,
        timestamp: new Date().toISOString(),
        conditions: {
          mood,
          target,
          season,
          style,
          color,
          textLength,
        },
      });
    } catch (apiError: any) {
      console.error("OpenAI API 호출 중 오류:", apiError);

      // 인증 오류 (401) 처리
      if (apiError.status === 401) {
        return NextResponse.json(
          {
            error: "AI 서비스 인증에 실패했습니다. 관리자에게 문의해주세요.",
            details: "OpenAI API 키가 유효하지 않습니다.",
            code: "authentication_failed",
          },
          { status: 500 }
        );
      }

      // API 할당량 초과 (429) 처리
      if (apiError.status === 429) {
        return NextResponse.json(
          {
            error:
              "현재 AI 서비스 사용량이 많습니다. 잠시 후 다시 시도해주세요.",
            details: "OpenAI API 할당량 초과",
            code: "rate_limit_exceeded",
          },
          { status: 429 }
        );
      }

      // 기타 API 오류
      throw apiError;
    }
  } catch (error: any) {
    console.error("웨딩 청첩장 데이터 생성 API 오류:", error);

    const errorMessage = error.message || "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json(
      {
        error: `웨딩 청첩장 데이터 생성 중 오류가 발생했습니다: ${errorMessage}`,
        details: error.response?.data || error.error || {},
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};

export const POST = generateWeddingContent;
