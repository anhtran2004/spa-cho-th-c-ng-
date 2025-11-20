var getCurrentUser = localStorage.getItem("currentUser");

if (!getCurrentUser) {
  window.location.href = "index.html";
} else {
  let currentUser = JSON.parse(getCurrentUser);
  //Hiển thị navbar đã đăng nhập
  var headerNavbarWrapElement = document.querySelector(".header__navbar-wrap");
  headerNavbarWrapElement.innerHTML = `
      <li class="header__navbar-item header__navbar-user">
        <img src="data:image/jpeg;base64,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"
            alt="" class="header__navbar-user-img">
        <span class="header__navbar-user-name">${currentUser.fullname}</span>
    
        <ul class="header__navbar-user-menu">
            <li class="header__navbar-user-item header__navbar-user-item--account">
                <a href="user.html" class="ti-id-badge"> Tài khoản</a>
            </li>
            <li class="header__navbar-user-item">
                <a href="" class="ti-location-pin"> Địa chỉ</a>
            </li>
            <li class="header__navbar-user-item">
                <a href="" class="ti-shopping-cart-full"> Đơn mua</a>
            </li>
            <li class="header__navbar-user-item header__navbar-user-item--separate">
                <a href="" class="ti-back-right"> Đăng xuất</a>
            </li>
        </ul>
    </li>
    `;

  //Hiển thị thông tin cá nhân
  const userIndexInfoElement = document.querySelector(".user-index-info");
  userIndexInfoElement.innerHTML = `
      <div class="user-index-box user-index-fullname">
          <span class="user-index-info-label">Họ và tên:</span>
          <span class="user-index-info-value">${currentUser.fullname}</span>
      </div>
      <div class="user-index-box user-index-info-email">
          <span class="user-index-info-label">Email:</span>
          <span class="user-index-info-value">${currentUser.email}</span>
      </div>
      <div class="user-index-box user-index-info-address">
          <span class="user-index-info-label">Địa chỉ:</span>
          <span class="user-index-info-value">${currentUser.province}</span>
      </div>
    `;
}

//Dăng xuất
const logoutBtn = document.querySelector(".header__navbar-user-item--separate");
logoutBtn.onclick = function () {
  localStorage.removeItem("currentUser");
};

//Cập nhật thông tin cá nhân
const userIndexBtnElement = document.querySelector(".user-index-btn");
userIndexBtnElement.onclick = function () {
  alert("Chức năng này chưa hoạt động");
};
