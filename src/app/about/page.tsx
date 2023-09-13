import Link from 'next/link';
import { SkillChip } from './components';

export const metadata = {
  title: 'Rud - about',
  description: 'Rud-about',
};

export default function AboutPage() {
  return (
    <main className="px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10">
      <p className="text-sm text-black dark:text-slate-300">Latest Update: 2023. 6. 12.</p>

      <section className="border-b-[2px] py-10">
        <header className="pb-10">
          <p className="text-4xl font-bold">정 경훈</p>
          <p className="text-2xl font-bold">Kyung-Hoon Jung (Rud)</p>
        </header>

        <article className="leading-6 pb-10">
          <p>아름다운 세상을 위해 일하는 개발자 정경훈 입니다.</p>
          <p>유저에게 더멋진 뷰를 보이기 위해서 다양한 기술을 찾아보길 좋아합니다. 또한,</p>
          <p>사용자의 경험을 매우 중요히 여기고 있습니다.</p>
          <p>사용자가 편하게 느낀 부분과</p>
          <p>불편하게 느끼는 부분 모두를 분석해</p>
          <p>그이유를 찾아서 개선 하고자 노력합니다.</p>
        </article>

        <div className="pl-6">
          <p>
            📧 Email:{' '}
            <Link
              className="text-blue-300 font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              href="mailto:ruderud0055@gmail.com"
            >
              Ruderud0055@gmail.com
            </Link>
          </p>
          <p>
            🐱 Github:{' '}
            <Link
              className="text-blue-300 font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              href="https://github.com/Ruderud"
              target="_blank"
            >
              https://github.com/Ruderud
            </Link>
          </p>
        </div>
      </section>

      <section className="border-b-[2px] py-10">
        <header className="pb-10">
          <p className="text-2xl font-bold">🏢 Work Experience</p>
        </header>

        <article className="pb-10 pl-6 max-[400px]:pl-0">
          <p className="text-xl font-bold">Three ducks</p>
          <p className="text-sm text-black dark:text-slate-300 pb-10">2023. 1. - 2023. 5. | Web Engineer (Intern)</p>

          <div className="pl-6 max-[400px]:pl-0 pb-10">
            <p className="text-lg font-bold">Stari Web</p>
            <p className="text-md">
              <Link
                className="text-blue-300 font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                href="https://stari.io"
                target="_blank"
              >
                Stari
              </Link>
              는 300여명 이상의 다양한 스타와 그들의 팬들을 영상을 통해 연결해주는 플랫폼입니다.
            </p>
            <p className="text-md">
              신규 스타 등록 및 고객의 영상 구입, 신규 기능 추가, 유지보수등의 운영업무 전반을 담당했습니다.
            </p>
            <div className="text-sm max-[400px]:text-xs flex gap-2 pt-2 max-[400px]:max-w-[100vw] max-[400px]:overflow-scroll scrollbar-hide">
              <SkillChip name="Shopify" />
              <SkillChip name="Liquid" />
              <SkillChip name="JavaScript" />
              <SkillChip name="AWS Lambda" />
              <SkillChip name="AWS S3" />
            </div>

            <ul className="pl-4 pt-5 list-disc flex flex-col gap-y-4 ">
              <li>
                <strong>Lagacy Order API Migration: </strong>
                기존의 사용중인 주문 관리 API가 deprecated됨에 따라 최신 API로 교체 작업 진행.
              </li>
              <li>
                <strong>신규 프로모션 릴리즈: </strong> 뽀로로 프로모션 시작에 따라 디자이너와 협업하여 베너, 주문페이지
                등 프로모션 관련 컴포넌트 구현.
              </li>
              <li>
                <strong>비디오 뷰 페이지 리뉴얼 릴리즈: </strong>다양한 사이즈의 Video의 가시성 향상을 위해 반응형
                컴포넌트로 작성.
              </li>
              <li>
                <strong>주문 페이지 리뉴얼 릴리즈: </strong> 주문 튜토리얼 및 프로세스 관련 전달사항들 리뉴얼. 주문 폼
                페이지 UI 개선.
              </li>
            </ul>
          </div>

          <div className="pl-6 max-[400px]:pl-0">
            <p className="text-lg font-bold">Stari Admin Tool</p>
            <p className="text-md">
              Stari에서의 스타 신규 계약 및 관리, 고객 주문사항 관리, 정산 관련 내용을 다루는 관리자 웹
              어플리케이션입니다.
            </p>
            <div className="text-sm max-[400px]:text-xs flex gap-2 pt-2 max-[400px]:max-w-[100vw] max-[400px]:overflow-scroll scrollbar-hide">
              <SkillChip name="React" />
              <SkillChip name="TypeScript" />
              <SkillChip name="Redux Tool Kit" />
              <SkillChip name="AWS Lambda" />
              <SkillChip name="AWS DynamoDB" />
            </div>

            <ul className="pl-4 pt-5 list-disc flex flex-col gap-y-4">
              <li>
                <strong>신규 스타 가입 폼 리뉴얼 릴리즈: </strong>
                기존의 스타 가입 폼이 복잡하고 불편하다는 피드백을 받아 리뉴얼. 정보 관심사에 따라 view를 분리하여
                각각의 입력사항에 집중 할 수 있는 Form Wizard UI로 개선.
              </li>
              <li>
                <strong>JS to TS Migration: </strong>
                기존의 JS 코드를 TS로 마이그레이션 작업 진행. 기존의 JS 코드에 대한 타입 정의 및 타입 에러 수정. TS
                코드에서 Any Type을 최대한 제거하고, Strict 모드를 적용하여 타입 안정성 향상. 관심사에 따라 type을
                분리하여 재사용성 향상.
              </li>
              <li>
                <strong>주문 내역 검색기능 릴리즈: </strong>
                DynamoDB Expression를 이용하여 고객 주문 내역에 대한 Compound Filter 기능 구현. Index를 사용하여
                Optimizing.
              </li>
              <li>
                <strong>i18n 릴리즈: </strong>
                React-i18next 라이브러리를 이용하여 다국어 지원 기능 구현. JSON Nested Key 타입을 선언하여 사용하도록
                적용하여 타입 안정성 향상.
              </li>
            </ul>
          </div>
        </article>
      </section>

      <section className="border-b-[2px] py-10">
        <header className="pb-10">
          <p className="text-2xl font-bold">🛠️ Skills</p>
        </header>

        <div className="pl-6 text-sm flex gap-2">
          <SkillChip name="HTML/CSS" />
          <SkillChip name="React" />
          <SkillChip name="TypeScript" />
          <SkillChip name="NodeJS" />
        </div>
      </section>

      <section className="border-b-[2px] py-10">
        <header className="pb-10">
          <p className="text-2xl font-bold">🎓 Education</p>
        </header>

        <article className="pl-6">
          <div>
            <p className="text-xl font-bold">엘리스 SW 엔지니어 트랙 1기</p>
            <p className="text-sm text-black dark:text-slate-300 pb-5">2021. 10. 26. - 2022. 2. 25.</p>
          </div>

          <div>
            <p className="text-xl font-bold">상명대학교 화공신소재학과</p>
            <p className="text-sm text-black dark:text-slate-300 pb-5">2013. 3. - 2020. 2.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
