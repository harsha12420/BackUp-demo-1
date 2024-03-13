export enum RegexEnum {
  name = "^[a-zA-Z ]*$",
  phone = "^[0-9]*$",
  otp = "[0-9]\\d{5}",
  amount = "^([0-9]+(.[0-9]+)?)",
  numeric = "^[0-9]*.?[0-9]+$",
  alpha_spaces = "^[a-zA-Z ]+$",
  alpha_numeric = "^[a-zA-Z0-9_ ]+$",
  email = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}",
  mobile = "^[0-9]{10,10}$",
  url = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?",
  zipcode = "^[0-9]{5}(?:-[0-9]{4})?$",
  passwordValidation = "^(?=.{6,15})(?=.*?[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^!}[{&*+=~`*:.]).*$",
  countryCode = "^(\\+?\\d{1,3})$",
  single = "single",
  zero = 0,
  oneto100 = "^[1-9][0-9]?$|^100$",
  oneto10 = "^(?:[1-9]|0[1-9]|10)$",
  zeroto100 = "^([0-9]+){0,1}(.[0-9]{1,2}){0,1}$",
  price = "^[1-9][0-9]*",
  color = "^[a-z]+$",
  ifsc_code = '^[A-Z]{4}0[A-Z0-9]{6}$'
}