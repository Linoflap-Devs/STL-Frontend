
export const formatKey = (key: string) => {
  const mapping: { [key: string]: string } = {
    firstName: "Given Name",
    lastName: "Last Name",
    suffix: "Suffix",
    operatorName: "Operator Name",
    phoneNumber: "Phone Number",
    email: "Email",
    userName: "Username",
    password: "Password",
  };
  return mapping[key] || key;
};