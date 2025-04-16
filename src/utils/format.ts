
export const formatKey = (key: string) => {
  const mapping: { [key: string]: string } = {
    firstName: "Given Name",
    lastName: "Last Name",
    suffix: "Suffix",
    operatorName: "Assigned Company",
    phoneNumber: "Phone Number",
    email: "Email",
    userName: "Username",
    password: "Password",
    AreaOfOperations: "Area Of Operations",
  };
  return mapping[key] || key;
};