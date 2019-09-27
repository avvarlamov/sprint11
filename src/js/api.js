class Api {
  constructor({ baseUrl, headers }) {
    this.url = baseUrl;
    this.headers = headers;
  }

  getResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res.status);
    }
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers
    }).then(res => {
      return this.getResponse(res);
    });
  }

  getUserName() {
    return fetch(`${this.url}/users/me`, {
      headers: this.headers
    }).then(res => {
      return this.getResponse(res);
    });
  }

  patchUserName(nameValue, linkValue) {
    return fetch(`${this.url}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name: nameValue,
        about: linkValue
      })
    }).then(res => {
      return this.getResponse(res);
    });
  }
}
export { Api };
