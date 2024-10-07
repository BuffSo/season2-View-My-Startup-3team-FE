import styles from "./StartupDetailInvest.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Pagination from "../Common/Pagination";

const MAX_ITEMS = 5;

export default function StartupDetailInvest() {
  return (
    <>
      <div className={styles.header}>
        View My Startup에서 받은 투자
        <Link to={`/investment`}>
          <button className={styles.button}>기업 투자하기</button>
        </Link>
      </div>
      <div style={{ margin: "1.6rem", fontSize: "2rem", fontWeight: "2.4rem" }}>
        총 원
      </div>
      <table className={styles.table}>
        <td className={styles.td}>
          <th style={{ width: "8.4rem" }}>투자자 이름</th>
          <th style={{ width: "8.4rem" }}>순위</th>
          <th style={{ width: "8.4rem" }}>투자금액</th>
          <th style={{ width: "88.4rem" }}>투자 코멘트</th>
        </td>
        <tr>투자 상세 목록 금액순 출력-수정삭제 기능 추가(한번에 5줄 로딩)</tr>
        <div>
          <Pagination />
        </div>
      </table>
    </>
  );
}