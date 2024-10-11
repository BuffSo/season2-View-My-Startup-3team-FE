import styles from './MySelection.module.css';
import btn_plus from '../../assets/btn_plus.svg';
import MySelectionModal from './MySelectionModal';
import CompareSelectionModal from './CompareSelectionModal';
import { useState, useEffect } from 'react';
import ic_minus from '../../assets/ic_minus.svg';
import ic_restart from '../../assets/ic_restart.svg';
import useFetchMySelection from '../../hooks/useFetchMySelection';
import useFetchCompare from '../../hooks/useFetchCompare.js';
import useFetchCompareResult from '../../hooks/useFetchCompareResult';
import noImageIcon from '../../assets/no-image.png';
import { formatAmount } from '../../utils/formatAmount.js';
import useFetchCancelMySelection from '../../hooks/useFetchCancelMySelection.js';
import useFetchCancelCompare from '../../hooks/useFetchCancelCompare.js';
import CompareDropdown from './CompareDropdown.js';
import InvestModal from './InvestModal.js';
import useFetchRank from '../../hooks/useFetchRanck.js';
import RankDropdown from './RankDropdown.js';

export default function MySelection() {
  const [isModal, setIsModal] = useState(false);
  const [isComparedModal, setIsComparedModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState([]);
  const [compareSelectedStartups, setCompareSelectedStartups] = useState([]);
  const { fetchMySelection } = useFetchMySelection();
  const { fetchComparison } = useFetchCompare();
  const [isComparisonDone, setIsComparisonDone] = useState(false);
  const { allResults, setOrder, setSort, fetchResult } = useFetchCompareResult(
    'desc',
    'simInvest'
  );
  const { fetchCancelMySelection } = useFetchCancelMySelection();
  const { fetchCancelComparison } = useFetchCancelCompare();
  const [sortOption, setSortOption] = useState('simInvest_desc');
  const [isInvestModal, setIsInvestModal] = useState(false);
  const selectedStartupIds = selectedStartup.map((startup) => startup.id);
  const startupId =
    selectedStartupIds.length > 0 ? selectedStartupIds[0] : null;
  const { rankData, setOrderBy, setSortBy } = useFetchRank(
    startupId,
    'revenue',
    'desc'
  );
  const [sortOptionBy, setSortOptionBy] = useState('revenue_desc');

  useEffect(() => {
    // 마지막 언더바를 기준으로 나누기 위해 정규식 사용
    const [sortValue, orderValue] = sortOption.split(/_(?=[^_]*$)/);
    setSort(sortValue);
    setOrder(orderValue);
  }, [sortOption, setOrder, setSort]);

  useEffect(() => {
    // 마지막 언더바를 기준으로 나누기 위해 정규식 사용
    const [orderValue, sortValue] = sortOptionBy.split(/_(?=[^_]*$)/);
    setOrderBy(orderValue);
    setSortBy(sortValue);
  }, [sortOptionBy, setSortBy, setOrderBy]);

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleSelectStartup = (startup) => {
    if (!selectedStartup.some((s) => s.id === startup.id)) {
      setSelectedStartup((prev) => [...prev, startup]);
    }
  };

  const handleRemoveStartup = (id) => {
    setSelectedStartup((prev) => prev.filter((startup) => startup.id !== id));
  };

  const handleOpenComparedModal = () => {
    setIsComparedModal(true);
  };

  const handleCloseComparedModal = () => {
    setIsComparedModal(false);
  };

  const handleCompareSelectStartups = (startups) => {
    setCompareSelectedStartups(startups);
  };

  const handleCompareRemoveStartups = (id) => {
    setCompareSelectedStartups((prev) =>
      prev.filter((startup) => startup.id !== id)
    );
  };

  const handleResetAll = () => {
    setSelectedStartup([]);
    setCompareSelectedStartups([]);
    setIsComparisonDone(false);
  };

  const handleCompareButtonClick = async () => {
    const promise = selectedStartup.map((startup) => {
      return fetchMySelection(startup.id);
    });
    await Promise.all(promise);

    const ids = compareSelectedStartups.map((startup) => startup.id);
    await fetchComparison(ids);
    await fetchResult();
    setIsComparisonDone(true);
  };

  const handleCloseCompare = () => {
    setIsComparisonDone(false);
  };

  const handleCancelButtonClick = async () => {
    const promise = selectedStartup.map((startup) => {
      return fetchCancelMySelection(startup.id);
    });
    await Promise.all(promise);
    const ids = compareSelectedStartups.map((startup) => startup.id);
    await fetchCancelComparison(ids);
    await fetchResult();
  };

  const handleOpenInvestModal = () => {
    setIsInvestModal(true);
  };

  const handleCloseInvestModal = (e) => {
    setIsInvestModal(false);
    e.preventDefault();
  };

  return (
    <div className={styles.section}>
      <div className={styles.myNav}>
        {!isComparisonDone && (
          <div className={styles.headerBox}>
            <h2 className={styles.headerTxt}>나의 기업을 선택해주세요!</h2>
            {compareSelectedStartups.length > 0 && (
              <button className={styles.resetBtn} onClick={handleResetAll}>
                <img
                  src={ic_restart}
                  alt="loadingLogo"
                  className={styles.loadingLogo}
                />
                전체 초기화
              </button>
            )}
          </div>
        )}
        {isComparisonDone && (
          <div className={styles.doneCompareBox}>
            <h2 className={styles.doneCompareTxt}>내가 선택한 기업</h2>
            <button
              className={styles.beforeBtn}
              onClick={() => {
                handleCloseCompare();
                handleCancelButtonClick();
              }}
            >
              다른 기업 비교하기
            </button>
          </div>
        )}
      </div>
      <div
        className={styles.borderBox}
        style={{ border: selectedStartup.length > 0 ? 'none' : '' }}
      >
        <div className={styles.innerBox}>
          {selectedStartup.map((startup) => (
            <div key={startup.id} className={styles.selectedStartup}>
              <img
                src={startup.image || noImageIcon}
                alt="startupImg"
                className={styles.startupImg}
                style={{
                  verticalAlign: 'middle',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  objectFit: 'cover'
                }}
              />
              <span className={styles.startupName}>{startup.name}</span>
              <span className={styles.startupCategory}>
                {startup.category.category}
              </span>
              {!isComparisonDone && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveStartup(startup.id)}
                >
                  선택 취소
                </button>
              )}
            </div>
          ))}
          {selectedStartup.length === 0 && (
            <div>
              <img
                className={styles.plusBtnImg}
                src={btn_plus}
                alt="Add startup"
                onClick={handleOpenModal}
              />
              <h3>기업 추가</h3>
            </div>
          )}
        </div>
      </div>
      {!isComparisonDone && selectedStartup.length > 0 && (
        <div className={styles.section}>
          <div className={styles.selectedHeader}>
            <span>어떤 기업이 궁금하세요?</span>
            <button
              onClick={handleOpenComparedModal}
              className={`${styles.addBtn} ${
                compareSelectedStartups.length >= 5
                  ? styles.disabledBtn
                  : styles.addBtn
              }`}
              disabled={compareSelectedStartups.length >= 5}
            >
              기업 추가하기
            </button>
          </div>
          <div
            className={styles.borderBox}
            style={{ border: selectedStartup.length > 0 ? 'none' : '' }}
          >
            <div
              style={{ border: selectedStartup.length > 0 ? 'none' : '' }}
              className={styles.innerBox}
            >
              {compareSelectedStartups.length === 0 ? (
                <h2>
                  아직 추가된 기업이 없어요. <br /> 버튼을 눌러 기업을
                  추가해보세요!
                </h2>
              ) : (
                compareSelectedStartups.map((startup) => (
                  <div
                    key={startup.id}
                    className={styles.compareSelectedStartup}
                  >
                    <img
                      src={ic_minus}
                      alt="minus"
                      className={styles.minusIcon}
                      onClick={() => handleCompareRemoveStartups(startup.id)}
                    />
                    <img
                      src={startup.image || noImageIcon}
                      alt="startupImg"
                      className={styles.startupImg}
                      style={{
                        verticalAlign: 'middle',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        objectFit: 'cover'
                      }}
                    />
                    <span className={styles.startupName}>{startup.name}</span>
                    <span className={styles.startupCategory}>
                      {startup.category.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {!isComparisonDone && (
        <button
          className={`${styles.compareBtn} ${
            selectedStartup.length > 0 && compareSelectedStartups.length > 0
              ? styles.compareActiveBtn
              : styles.compareBtn
          }`}
          disabled={
            selectedStartup.length > 0 && compareSelectedStartups.length > 0
              ? false
              : true
          }
          onClick={() => {
            handleCompareButtonClick();
          }}
        >
          기업 비교하기
        </button>
      )}
      {isModal && (
        <MySelectionModal
          onClose={handleCloseModal}
          onSelectStartup={handleSelectStartup}
        />
      )}
      {isComparedModal && (
        <CompareSelectionModal
          selectedStartups={compareSelectedStartups}
          onSelectStartup={handleCompareSelectStartups}
          onClose={handleCloseComparedModal}
          existingSelectedStartups={selectedStartup}
        />
      )}
      {isComparisonDone && ( // 비교 완료 상태일 때 비교 결과 표시
        <div className={`${styles.section} ${styles.comparisonDoneBox}`}>
          <div className={isComparisonDone ? styles.doneNav : styles.myNav}>
            <h2
              className={isComparisonDone ? styles.doneTxt : styles.headerTxt}
            >
              비교 결과 확인하기
            </h2>
            <CompareDropdown setSortOption={setSortOption} />
          </div>
          <div style={{ width: '117rem', overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '21.3rem' }}>기업명</th>
                  <th style={{ width: '30.4rem' }}>기업소개</th>
                  <th style={{ width: '15.4rem' }}>카테고리</th>
                  <th style={{ width: '15.4rem' }}>누적 투자 금액</th>
                  <th style={{ width: '15.4rem' }}>매출액</th>
                  <th style={{ width: '15.4rem' }}>고용 인원</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((result) => (
                  <tr
                    key={result.id}
                    className={
                      selectedStartup.some(
                        (startup) => startup.id === result.id
                      )
                        ? styles.selectedStartupRow
                        : ''
                    }
                  >
                    <td style={{ textAlign: 'left', paddingLeft: '7rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      >
                        <img
                          src={result.image || noImageIcon}
                          alt={`${result.name} 로고`}
                          style={{
                            width: '3.2rem',
                            height: '3.2rem',
                            marginRight: '0.8rem',
                            verticalAlign: 'middle',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            objectFit: 'cover'
                          }}
                        />
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      >
                        {result.name}
                      </span>
                    </td>
                    <td className={styles.description}>{result.description}</td>
                    <td>{result.category.category}</td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(result.simInvest)} 원
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(result.revenue)} 원
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '5.5rem' }}>
                      {formatAmount(result.employees)} 명
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isComparisonDone && ( // 비교 완료 상태일 때 비교 결과 표시
        <div className={`${styles.section} ${styles.comparisonDoneBox}`}>
          <div className={isComparisonDone ? styles.doneNav : styles.myNav}>
            <h2
              className={isComparisonDone ? styles.doneTxt : styles.headerTxt}
            >
              기업 순위 확인하기
            </h2>
            <RankDropdown setSortOptionBy={setSortOptionBy} />
          </div>
          <div style={{ width: '117rem', overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '6.8rem' }}>순위</th>
                  <th style={{ width: '21.3rem' }}>기업명</th>
                  <th style={{ width: '30.4rem' }}>기업소개</th>
                  <th style={{ width: '15.4rem' }}>카테고리</th>
                  <th style={{ width: '15.4rem' }}>누적 투자 금액</th>
                  <th style={{ width: '15.4rem' }}>매출액</th>
                  <th style={{ width: '15.4rem' }}>고용 인원</th>
                </tr>
              </thead>
              <tbody>
                {rankData.map((result) => (
                  <tr
                    key={result.id}
                    className={
                      selectedStartup.some(
                        (startup) => startup.id === result.id
                      )
                        ? styles.selectedStartupRow
                        : ''
                    }
                  >
                    <td>{result.rank}위</td>
                    <td style={{ textAlign: 'left' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      >
                        <img
                          src={result.image || noImageIcon}
                          alt={`${result.name} 로고`}
                          style={{
                            width: '3.2rem',
                            height: '3.2rem',
                            marginRight: '0.8rem',
                            verticalAlign: 'middle',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            objectFit: 'cover'
                          }}
                        />
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle'
                        }}
                      >
                        {result.name}
                      </span>
                    </td>
                    <td className={styles.description}>{result.description}</td>
                    <td>{result.category}</td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(result.simInvest)} 원
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(result.revenue)} 원
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '5rem' }}>
                      {formatAmount(result.employees)} 명
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isComparisonDone && (
        <button className={styles.investBtn} onClick={handleOpenInvestModal}>
          나의 기업에 투자하기
        </button>
      )}
      {isInvestModal && (
        <InvestModal
          onClose={handleCloseInvestModal}
          startup={selectedStartup}
        />
      )}
    </div>
  );
}
