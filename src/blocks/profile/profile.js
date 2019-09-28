import { api } from "../../index";

class UserName {
  constructor() {
    api
      .getUserName()
      .then(userData => this.fillUserInfo(userData))
      .catch(err => {
        console.log(err);
      });
  }

  fillUserInfo(userData) {
    document.querySelector(".user-info__name").textContent = userData.name;
    document.querySelector(".user-info__job").textContent = userData.about;
    document.querySelector(
      ".user-info__photo"
    ).style.backgroundImage = `url(${userData.avatar})`;
  }
}
export { UserName };
