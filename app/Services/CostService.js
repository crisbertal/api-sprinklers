// El primer año es 8 por defecto
const gValue = (n, Csub, P, g) => {
    return g - P - 0.5 + (Csub / n);
}

const COSTE_SECANO = 5
const COSTE_RIEGO_RIO = 20

const getSubUnderCost = (n, Csub, P, g) => {
    // TODO comprueba cuando los valores < 0
    return Math.max(0, g < 8 ? 20 : 20 + (g - 8) ^ 2)
}

export { gValue, getSubUnderCost, COSTE_SECANO, COSTE_RIEGO_RIO }
