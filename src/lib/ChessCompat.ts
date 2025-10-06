// Funciona con versiones que usan camelCase (isCheck) y snake_case (in_check)
export function isCheck(ch: any): boolean {
  return typeof ch.isCheck === 'function' ? ch.isCheck() : ch.in_check();
}
export function isCheckmate(ch: any): boolean {
  return typeof ch.isCheckmate === 'function' ? ch.isCheckmate() : ch.in_checkmate();
}
export function isStalemate(ch: any): boolean {
  return typeof ch.isStalemate === 'function' ? ch.isStalemate() : ch.in_stalemate();
}
