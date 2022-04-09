const GROUND_INCOME = 100

const getRiverIncome = (Criver, n, P) => {
    return 100 * kValue(Criver, n, P)
}

const kValue = (Criver, n, P) => {
    let num = (Criver / n) - (1.5 + P)
    let den = 10 - (1.5 + P)
    let k = 1 - (num / den)
    return k > 1 ? 1 : k
}

const getDryIncome = (P) => {
    if (P == 1) return 30;
    if (P == 2) return 40;
    if (P == 0) return 10;
}

export { GROUND_INCOME, getRiverIncome, getDryIncome }
