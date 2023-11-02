import { Main } from '@/components/Ui/Main';

export default function ServerlessPage() {
  return (
    <Main>
      <h1 className="text-xl font-bold">serverless init</h1>
      <br />

      <p>aws credential configration이 되어있다는 전제.</p>

      <p>$ sls create -t aws-nodejs-typescript</p>
      <p>$ yarn install</p>
      <p>$ yarn set version stable //v4 설치</p>
      <p>$ yarn dlx @yarnpkg/sdks vscode // allow해서 현재 프로젝트 타입스크립트 sdk 적용</p>
      <p>프로젝트 폴더 루트 위치에 serverless.yml 생성 & 작성</p>
      <p>필요한 빌드나 의존성들 기입 & 설치후 sls deploy</p>
    </Main>
  );
}
