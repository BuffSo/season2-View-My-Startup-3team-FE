import styles from './InvestmentDropdown.module.css';
import arrowDown from '../../assets/ic_toggle.svg';
import Dropdown from '../Dropdown';
import { useState } from 'react';
import { useSort } from '../../contexts/SortContext';

export default function InvestmentDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { sortOption, setSortOption } = useSort();

  const options = [
    { value: 'invest_amount_desc', label: 'View My Startup 투자 금액 높은 순' },
    { value: 'invest_amount_asc', label: 'View My Startup 투자 금액 낮은 순' },
    { value: 'actual_invest_desc', label: '실제 누적 투자 금액 높은 순' },
    { value: 'actual_invest_asc', label: '실제 누적 투자 금액 낮은 순' }
  ];

  const handleOptionClick = (val) => {
    console.log('Seleted sort Option:', val);
    setSortOption(val);
    setIsOpen(false);
  };

  return (
    <div className={styles.menu}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.value === sortOption)?.label ||
          'Select...'}
        <img className={styles.icon} src={arrowDown} />
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
