export type Path<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${Path<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
