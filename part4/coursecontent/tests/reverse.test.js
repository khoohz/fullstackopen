//jest expecrs test files names to contain .test
//import the fx to be tested
const reverse = require('../utils/for_testing').reverse

//individual test cases
//first para: test desc
//second para: defines functionality for test case
test('reverse of a', () => {
  const result = reverse('a')

  //Expect wraps the resulting value into an object
  //that offers a collection of matcher functions (toBe),
  //that can be used for verifying the correctness of the result
  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})