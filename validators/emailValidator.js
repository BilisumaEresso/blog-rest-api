const validateEmail = (email) => {
  const regex =
    /^(?=.{1,254}$)(?=.{1,64}@)(?!.*\.\.)[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
  return regex.test(String(email).trim());
};


module.exports=validateEmail