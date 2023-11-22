function sum(a, b) {
  return a + b
}

test('sumar 1 + 2 debería ser igual a 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('sumar 0 + 0 debería ser igual a 0', () => {
  expect(sum(0, 0)).toBe(0)
})

test('sumar -1 + 1 debería ser igual a 0', () => {
  expect(sum(-1, 1)).toBe(0)
})