function toMap(params:object): Map<string, any> {
  const result = new Map()
  const keys = Object.keys(params)
  const values = Object.values(params)
  keys.forEach((item, index) => {
    result.set(item, values[index])
  })
  return result
}

export const METHODS = [
  {key: 'get', color: 'green'},
  {key: 'post', color: 'lime'},
  {key: 'put', color: 'cyan'},
  {key: 'delete', color: 'red'}
]

export const METHODS_COLOR = new Map<string, string>()
METHODS_COLOR.set('get', 'blue')
METHODS_COLOR.set('post', 'green')
METHODS_COLOR.set('put', 'cyan')
METHODS_COLOR.set('delete', 'red')

export const HEADERS_KEYS_VALUES = toMap({
  "Accept": [],
  "Accept-Encoding": [],
  "Content-Type": [],
  'Authorization': '',
  "Cookie": ''
})
export const HEADERS_KEYS = Object.keys({
  "Accept": [],
  "Accept-Encoding": [],
  "Content-Type": [],
  'Authorization': '',
  "Cookie": ''
})
