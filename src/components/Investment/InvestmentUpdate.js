import styles from './InvestmentCreate.module.css';
import X from '../../assets/ic_x.svg';
import visibilityOn from '../../assets/btn_visibility_on.svg';
import visibilityOff from '../../assets/btn_visibility_off.svg';
import { useState } from 'react';
import { patchInvestment } from '../../api/InvestmentService';
import useValidate from '../../hooks/useValidate';
import Modal from '../Common/Modal';

export default function InvestmentCreate({
  onClose,
  startup,
  mockInvestor,
  initialValues
}) {
  const { image, name, categoryName } = startup || {};
  const { values, errors, handleChange, validate, handleBlur } = useValidate({
    name: initialValues?.name || '',
    investAmount: initialValues?.investAmount || '',
    comment: initialValues?.comment || '',
    password: initialValues?.password || '',
    checkPassword: ''
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkPasswordVisible, setCheckPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleCheckPasswordVisibility = () => {
    setCheckPasswordVisible(!checkPasswordVisible);
  };

  const isInputEmpty = () => {
    return (
      values.name.trim() !== '' &&
      values.investAmount.trim() !== '' &&
      values.comment.trim() !== '' &&
      values.password.trim() !== '' &&
      values.checkPassword.trim() !== ''
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const investAmount = parseFloat(values.investAmount);

    try {
      const investment = { ...values, investAmount };
      delete investment.checkPassword;

      const updateRes = await patchInvestment(mockInvestor.id, investment);
      console.log('Update Response:', updateRes);

      if (updateRes.status === 200) {
        onClose();
      } else {
        console.log(updateRes.status);
        setError('수정 요청이 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('투자 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Modal>
        <form className={styles.form} onSubmit={handleUpdateSubmit}>
          <div>
            <h1>기업에 투자하기</h1>
            <img
              src={X}
              onClick={onClose}
              style={{ cursor: 'pointer' }}
              alt="close btn"
            />
          </div>
          <div>
            <h1>투자 기업 정보</h1>
            <div className={styles.startup}>
              <img src={image} alt={name} />
              <h1>{name}</h1>
              <p>{categoryName}</p>
            </div>
          </div>

          {/* 투자자 이름 */}
          <div className={styles.group}>
            <label htmlFor="name">투자자 이름</label>
            <input
              type="text"
              id="name"
              placeholder="투자자 이름을 입력해 주세요"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                border: errors.name
                  ? '0.1rem solid var(--error-color)'
                  : '0.1rem solid var(--secondary-gray-200)'
              }}
            />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>

          {/* 투자 금액 */}
          <div className={styles.group}>
            <label htmlFor="investAmount">투자 금액</label>
            <input
              type="text"
              id="investAmount"
              placeholder="투자 금액을 입력해 주세요"
              value={values.investAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                border: errors.investAmount
                  ? '0.1rem solid var(--error-color)'
                  : '0.1rem solid var(--secondary-gray-200)'
              }}
            />
            {errors.investAmount && (
              <div className={styles.error}>{errors.investAmount}</div>
            )}
          </div>

          {/* 투자 코멘트 */}
          <div className={styles.group}>
            <label htmlFor="comment">투자 코멘트</label>
            <textarea
              type="text"
              id="comment"
              placeholder="투자에 대한 코멘트를 입력해 주세요"
              value={values.comment}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                border: errors.comment
                  ? '0.1rem solid var(--error-color)'
                  : '0.1rem solid var(--secondary-gray-200)'
              }}
            />
            {errors.comment && (
              <div className={styles.error}>{errors.comment}</div>
            )}
          </div>

          {/* 비밀번호 */}
          <div className={styles.group}>
            <label htmlFor="password">비밀번호</label>
            <div className={styles.password}>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  border: errors.password
                    ? '0.1rem solid var(--error-color)'
                    : '0.1rem solid var(--secondary-gray-200)'
                }}
              />
              <img
                src={isPasswordVisible ? visibilityOff : visibilityOn}
                alt={isPasswordVisible ? '비밀번호 표시' : '비밀번호 숨기기'}
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.group}>
            <label htmlFor="checkPassword">비밀번호 확인</label>
            <div className={styles.password}>
              <input
                type={checkPasswordVisible ? 'text' : 'password'}
                id="checkPassword"
                placeholder="비밀번호를 다시 한 번 입력해 주세요"
                value={values.checkPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  border: errors.checkPassword
                    ? '0.1rem solid var(--error-color)'
                    : '0.1rem solid var(--secondary-gray-200)'
                }}
              />
              <img
                src={checkPasswordVisible ? visibilityOff : visibilityOn}
                alt={checkPasswordVisible ? '비밀번호 표시' : '비밀번호 숨기기'}
                onClick={toggleCheckPasswordVisibility}
              />
            </div>
            {errors.checkPassword && (
              <div className={styles.error}>{errors.checkPassword}</div>
            )}
          </div>
          <div className={styles.buttons}>
            <button className={styles.cancel} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.submit}
              type="submit"
              disabled={!isInputEmpty()}
            >
              수정하기
            </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </Modal>
    </>
  );
}