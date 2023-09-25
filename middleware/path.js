import helper from "@/helpers/index";

export default function({
  redirect,
  route
}) {
  // if (localStorage.hasOwnProperty("authSikd")) {
  //   var dataPath = helper.encrypt(route.fullPath);
  //   var dataLoginDecrypted = helper.decrypt(localStorage.authSikd);
  //   var dataUser = JSON.parse(dataLoginDecrypted);
  //   if (dataUser.kodeUser == 0) {
  //     sessionStorage.clear();
  //     localStorage.clear();
  //     sessionStorage.setItem("rd", dataPath);
  //     return redirect('/login')
  //   } else if (!dataUser.setRole) {
  //     sessionStorage.setItem("rd", dataPath);
  //     return redirect('/role')
  //   } else {
  //     sessionStorage.removeItem('rd');
  //   }
  // } else {
  //   var dataPath = helper.encrypt(route.fullPath);
  //   sessionStorage.clear();
  //   localStorage.clear();
  //   sessionStorage.setItem("rd", dataPath);
  //   return redirect('/login')
  // }

}