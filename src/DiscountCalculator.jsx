// src/DiscountCalculator.jsx
import { useState } from "react";
import "./DiscountCalculator.css";

// Справочник категорий: id, название и скидка в процентах
const CATEGORIES = [
  { id: "electronics", label: "Электроника", discount: 5 },
  { id: "clothing", label: "Одежда", discount: 15 },
  { id: "groceries", label: "Продукты", discount: 10 },
  { id: "books", label: "Книги", discount: 20 },
  { id: "other", label: "Другое", discount: 0 },
];

// Ставка НДС в долях (22%)
const VAT_RATE = 0.22;

// Задание 2: промокод и его дополнительная скидка
const PROMO_CODE = "WELCOME10";
const PROMO_PERCENT = 10;

// Задание 3: границы ползунка ручной скидки
const CUSTOM_MIN = 0;
const CUSTOM_MAX = 50;

function DiscountCalculator() {
  // --- Состояние ---
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState("");

  // Задание 2: промокод (строка)
  const [promo, setPromo] = useState("");
  // Задание 3: включена ли ручная скидка и её значение
  const [useCustom, setUseCustom] = useState(false);
  const [customDiscount, setCustomDiscount] = useState(10);
  // Задание 4: начислять ли НДС
  const [includeVat, setIncludeVat] = useState(true);

  // --- Обработчики событий ---
  function handlePriceChange(e) {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setError("");
      setCalculated(false);
    }
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value);
    setCalculated(false);
  }

  function handlePromoChange(e) {
    setPromo(e.target.value);
    setCalculated(false);
  }

  function handleCustomToggle(e) {
    setUseCustom(e.target.checked);
    setCalculated(false);
  }

  function handleCustomDiscountChange(e) {
    // value у range-инпута — строка, переводим в число
    setCustomDiscount(Number(e.target.value));
    setCalculated(false);
  }

  function handleVatToggle(e) {
    setIncludeVat(e.target.checked);
    setCalculated(false);
  }

  function handleCalculate() {
    const parsed = parseFloat(price);

    if (!price.trim()) {
      setError("Введите цену товара");
      setCalculated(false);
      return;
    }

    if (isNaN(parsed) || parsed <= 0) {
      setError("Цена должна быть положительным числом");
      setCalculated(false);
      return;
    }

    setError("");
    setCalculated(true);
  }

  function handleReset() {
    setPrice("");
    setCategory("electronics");
    setPromo("");
    setUseCustom(false);
    setCustomDiscount(10);
    setIncludeVat(true);
    setCalculated(false);
    setError("");
  }

  // --- Вычисления ---
  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const numPrice = parseFloat(price) || 0;

  // Базовая скидка: ручная заменяет скидку категории
  const baseDiscountPercent = useCustom
    ? customDiscount
    : selectedCategory
      ? selectedCategory.discount
      : 0;

  // Промокод даёт ещё +10% поверх базовой скидки
  const promoApplied = promo.trim().toUpperCase() === PROMO_CODE;
  const promoPercent = promoApplied ? PROMO_PERCENT : 0;

  const baseDiscountAmount = calculated
    ? numPrice * (baseDiscountPercent / 100)
    : 0;
  const promoAmount = calculated ? numPrice * (promoPercent / 100) : 0;
  const priceAfterDiscount = calculated
    ? numPrice - baseDiscountAmount - promoAmount
    : 0;
  // НДС прибавляется только если включён переключатель
  const vatAmount =
    calculated && includeVat ? priceAfterDiscount * VAT_RATE : 0;
  const total = calculated ? priceAfterDiscount + vatAmount : 0;

  function formatRub(value) {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // --- Разметка ---
  return (
    <div className="calculator-wrapper">
      <h2 className="calculator-title">Калькулятор скидок</h2>

      {/* Поле ввода цены */}
      <div className="field">
        <label htmlFor="price" className="field__label">
          Цена товара (₽)
        </label>
        <input
          id="price"
          type="text"
          className={`field__input ${error ? "field__input--error" : ""}`}
          value={price}
          onChange={handlePriceChange}
          placeholder="Например: 1000"
          inputMode="decimal"
        />
        {error && <span className="field__error">{error}</span>}
      </div>

      {/* Выбор категории */}
      <div className="field">
        <label htmlFor="category" className="field__label">
          Категория товара
        </label>
        <select
          id="category"
          className="field__input field__select"
          value={category}
          onChange={handleCategoryChange}
          disabled={useCustom}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label} — скидка {cat.discount}%
            </option>
          ))}
        </select>
      </div>

      {/* Задание 3: ручная скидка (ползунок) */}
      <div className="field">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={useCustom}
            onChange={handleCustomToggle}
          />
          <span>Задать скидку вручную (заменяет скидку категории)</span>
        </label>
        <div className="slider">
          <input
            type="range"
            min={CUSTOM_MIN}
            max={CUSTOM_MAX}
            step={1}
            value={customDiscount}
            onChange={handleCustomDiscountChange}
            disabled={!useCustom}
            aria-label="Скидка вручную"
          />
          <span
            className={
              "slider__value" + (useCustom ? "" : " slider__value--disabled")
            }
          >
            {customDiscount}%
          </span>
        </div>
      </div>

      {/* Задание 2: промокод */}
      <div className="field">
        <label htmlFor="promo" className="field__label">
          Промокод
        </label>
        <input
          id="promo"
          type="text"
          className="field__input"
          value={promo}
          onChange={handlePromoChange}
          placeholder="Если есть"
        />
        {promoApplied && (
          <span className="field__hint field__hint--ok">
            Промокод применён: дополнительная скидка {PROMO_PERCENT}%
          </span>
        )}
        {promo.trim() && !promoApplied && (
          <span className="field__hint field__hint--warn">
            Такого промокода нет
          </span>
        )}
      </div>

      {/* Задание 4: переключатель НДС */}
      <div className="field">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={includeVat}
            onChange={handleVatToggle}
          />
          <span>Начислять НДС (22%)</span>
        </label>
      </div>

      {/* Кнопки */}
      <div className="actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCalculate}
        >
          Рассчитать
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleReset}
        >
          Сбросить
        </button>
      </div>

      {/* Результаты — только после расчёта */}
      {calculated && !error && (
        <div className="results">
          <h3 className="results__title">Результат расчёта</h3>
          <table className="results__table">
            <tbody>
              <tr>
                <td>Исходная цена</td>
                <td className="results__value">{formatRub(numPrice)} ₽</td>
              </tr>
              <tr>
                <td>
                  {useCustom
                    ? `Скидка вручную (${baseDiscountPercent}%)`
                    : `Скидка (${baseDiscountPercent}%, категория «${selectedCategory.label}»)`}
                </td>
                <td className="results__value results__value--discount">
                  −{formatRub(baseDiscountAmount)} ₽
                </td>
              </tr>
              {promoApplied && (
                <tr>
                  <td>
                    Промокод {PROMO_CODE} ({PROMO_PERCENT}%)
                  </td>
                  <td className="results__value results__value--discount">
                    −{formatRub(promoAmount)} ₽
                  </td>
                </tr>
              )}
              <tr>
                <td>Цена после скидки</td>
                <td className="results__value">
                  {formatRub(priceAfterDiscount)} ₽
                </td>
              </tr>
              <tr>
                <td>{includeVat ? "НДС (22%)" : "НДС"}</td>
                <td className="results__value">
                  {includeVat ? `+${formatRub(vatAmount)} ₽` : "не начисляется"}
                </td>
              </tr>
              <tr className="results__row--total">
                <td>Итого к оплате</td>
                <td className="results__value">{formatRub(total)} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DiscountCalculator;