<p align="center">
    <img src="https://github.com/ingame-app/ingame/assets/62270427/22c0b7f8-1ece-4fca-b95a-ff916ba682e9" width="200" alt="ingame"/>
  <br><br>
  하루하루 성장하는 경험을 하고 싶으신가요?
  <br/>
  Ingame을 통해 나만의 성장스토리를 만들어보세요
  <br/><br/>
  https://ingame.prgms-fullcycle.com/
</p>

## 🛠 기술스택

### 💡 공통
<img src="https://img.shields.io/badge/Typescript-5.3.3-blue" alt="Typescript"> <img src="https://img.shields.io/badge/Prettier-3.2.5-blue" alt="Prettier"> <img src="https://img.shields.io/badge/ESLint-8.57.0-blue" alt="ESLint">

### 💡 프론트엔드
<img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React"/> <img src="https://img.shields.io/badge/Tanstack Query-5.32.0-blue" alt="Tanstack-Query"/> <img src="https://img.shields.io/badge/Redux Toolkit-2.2.3-blue" alt="Redux-Toolkit"/> <br>
<img src="https://img.shields.io/badge/React Hook Form-7.51.3-blue" alt="React Hook Form"/>
<img src="https://img.shields.io/badge/React Router Dom-6.22.3-blue" alt="React Router Dom"/>
<img src="https://img.shields.io/badge/Styled components-6.1.8-blue" alt="Styled Components"/>
<img src="https://img.shields.io/badge/MSW-2.1.4-blue" alt="MSW"/>

### 💡 백엔드
<img src="https://img.shields.io/badge/Nest-10.3.1-blue" alt="NestJS"/> <img src="https://img.shields.io/badge/TypeORM-0.3.20-blue" alt="TypeORM"/> <br>
<img src="https://img.shields.io/badge/Winston-3.13.0-blue" alt="Winston"/> <img src="https://img.shields.io/badge/Swagger-7.3.1-blue" alt="Swagger"/> <img src="https://img.shields.io/badge/Redis-5.4.1-blue" alt="Redis"/> <img src="https://img.shields.io/badge/MariaDB-8.0.35-blue" alt="MariaDB"/>

## 🧰 협업 및 디자인

### 💡 협업
<img src="https://img.shields.io/badge/Notion-gray" alt="노션"/> <img src="https://img.shields.io/badge/Slack-gray" alt="슬랙"/> <img src="https://img.shields.io/badge/Gather-gray" alt="게더타운"/>

### 💡 디자인

<img src="https://img.shields.io/badge/Figma-gray" alt="Figma"/>

## 🙋🏻‍♂️ 팀원 소개

<table >
  <tbody>
      <td align="center">
        <div>
            <h3>BE</h3>
            <img src="https://ca.slack-edge.com/T061BFHLJJ1-U065H328KRA-6f7cd4988704-512" width="180px;" height="180px;" alt="신원익"/>
          <h3><a href="https://github.com/namu56"><b>신원익</b></a></h3>
        </div>
      </td>
      <td align="center">
        <div>
            <h3>BE</h3>
            <img src="https://ca.slack-edge.com/T061BFHLJJ1-U065FKP8N2X-cac1fb5fe0df-512" width="180px;" height="180px;" alt="김승균"/>
          <h3><a href="https://github.com/polaris9017"><b>김승균</b></a></h3>
        </div>
      </td>      
      <td align="center">
        <div>
            <h3>FE</h3>
            <img src="https://ca.slack-edge.com/T061BFHLJJ1-U065SGBC3GR-4e01ddf5130e-512" width="180px;" height="180px;" alt="김성현"/>
          <h3><a href="https://github.com/SungHyun627"><b>김성현</b></a></h3>
        </div>
      </td>      
      <td align="center">
        <div>
            <h3>FE</h3>
            <img src="https://ca.slack-edge.com/T061BFHLJJ1-U065DTXNWJX-a831a8c0840b-512" width="180px;" height="180px;" alt="윤정현"/>
          <h3><a href="https://github.com/yun6160"><b>윤정현</b></a></h3>
        </div>
      </td>      
      <td align="center">
        <div>
            <h3>FE</h3>
            <img src="https://ca.slack-edge.com/T061BFHLJJ1-U065B0SP7PX-c8132116aefa-512" width="180px;" height="180px;" alt="장석원"/>
          <h3><a href="https://github.com/aquaman122"><b>장석원</b></a></h3>
        </div>
      </td>      
  </tbody>
</table>

## 🪜 전체 아키텍쳐

(이미지 추가)

## 📁 디렉토리 구조

```
ingame
├── .github                         # Feature, PR, Bug template
└── client                          # client
├  ├── public                        # public
├  └── src
├     ├── apis                      # api 호출 Function
├     ├── assets                    # resoucres
├     ├── components                # 페이지를 구성하는 components
├     ├── constans                  # api, message, queryStirng, route 및 공통적으로 사용되는 constants
├     ├── hooks                     # Custom Hooks
├     ├── layout                    # 프로젝트 뼈대를 구성하는 Layout
├     ├─- mocks                     # MSW를 활용한 Mock data, handler
├     ├─- models                    # 프로젝트 전반에 걸쳐 사용되는 Type 정의
├     ├── pages                     # Pages
├     ├── routes                    # Routes config
├     ├── provider                  # Login, Query Provider
├     ├── Shared                    # 공통으로 사용되는 값 및 Dummy data
├     ├── store                     # 전역 Store
├     ├── styles                    # Global Style
├     ├── utils                     # date, axios 관련 util 함수
└── server                          # server
├   └── src
├   └── test
├
└── k8s
```
