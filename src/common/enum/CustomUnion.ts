/**
 * @name CustomUnion
 * @description value type을 union type으로 정의, 배열로도 여러 enum을 받을 수 있게 함
 *              그냥 enum을 사용하는 것보다 이쪽이 확장성이 더 좋은 것 같고 enum 사용할 때 문제가 있다고 하여 도입해봤음
 * @reference https://ajdkfl6445.gitbook.io/study/typescript/enum-type-union-type
 *            https://toss.tech/article/template-literal-types
 *            https://velog.io/@johnwi/enum-to-literal
 */

export type ValueType = string | number | boolean;

export type Union<
  T extends { [k: string]: ValueType } | ReadonlyArray<ValueType>,
> = T extends ReadonlyArray<ValueType>
  ? T[number]
  : T extends { [k: string]: infer U }
  ? U
  : never;
