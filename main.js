//Đối tượng Validator
function Validator(options) {
  function getParent(element, seletor) {
    //element truyền vào, selector trả về
    while (element.parentElement) {
      // kiểm tra element truyền vào có thẻ cha không để tránh lặp vô hạn, nếu có thẻ cha tương ứng mới chạy vòng lặp
      if (element.parentElement.matches(seletor)) {
        //kiểm tra có thẻ cha tương ứng với thẻ con ở trong không(vd: form-message nằm trong thẻ cha form-group)
        return element.parentElement; //trả về thẻ cha
      }
      element = element.parentElement; //Nếu không có thẻ cha tương ứng thì gán thẻ con đó cho thẻ cha rồi tiếp tục vòng lặp
    }
  }

  var selectorRules = {}; //Tạo object để gán các rule vào

  //hàm này để thực hiện việcc báo lỗi hoặc bỏ lỗi đi của Tên người dùng
  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.forGroupSelector).querySelector(options.errorSelector); //Lấy element cha hiện tại rồi từ element đó, kiếm class con là form-message
    var errorMessage; //rule là 1 phẩn tử của mảng, test là giá trị nhập, inputElement là giá trị nhập vào của 1 thẻ nào đó, value là giá trị,trả về lỗi hoặc không có lỗi

    //Lấy ra các rule của selector
    var rules = selectorRules[rule.seletor];

    //Lặp qua từng rule & kiểm tra, nếu có lỗi thì dừng việc kiểm tra,mục đích là sau mỗi lần lặp sẽ hiển thị các yêu cầu khác nhau(vd: lần 1 là nhập vào, nếu không nhập thì báo lỗi bắt nhập, nếu nhập sai thì báo nhập đúng)
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](formElement.querySelector(rule.seletor + ":checked"));
          break;
        default:
          errorMessage = rules[i](inputElement.value); //Lấy các giá trị của các dữ liệu nhập vào tương ứng với mỗi phần tử
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      //Nếu người dùng nhập sai
      errorElement.innerText = errorMessage; //xuất nội dung của errorMessage ra màn hình
      getParent(inputElement, options.forGroupSelector).classList.add("invalid"); // thêm class invalid vào thẻ cha của input
    } else {
      //Nếu người dùng nhập đúng
      errorElement.innerText = "";
      getParent(inputElement, options.forGroupSelector).classList.remove("invalid"); //xóa class
    }

    return !errorMessage; //true
  }
  //Lấy element của form cần validate
  var formElement = document.querySelector(options.form); //Lấy Element (thuộc tính) của form, vd như id,class..

  if (formElement) {
    //Nếu có element
    //Khisubmit form
    formElement.onsubmit = function (e) {
      //Nhận một đổi số khi bấm vào form submit,(onsubmit ở đây là 1 funciton định nghĩ sẵn)
      e.preventDefault(); //bỏ đối số e nhận được sau khi bấm submit

      var isFormValid = true;

      //Lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.seletor); // Lấy input của các element trong form-1
        var isValid = validate(inputElement, rule); //hàm này để thực hiện việc báo lỗi hoặc bỏ lỗi đi, trong trường hợp này nếu bấm submit thì sẽ thông báo tất cả các lỗi ở ô input
        if (!isValid) {
          //Nếu có 1 rule(tên đầy đủ,email,mật khẩu,nhập lại mật khẩu) không isValid(báo lỗi khi nhập sai hoặc bỏ thông báo đó khi nhập đúng) thì form sai
          isFormValid = false;
        }
      });
      //Lấy dữ liệu người dùng nhập vào
      if (isFormValid) {
        //Bấm đăng nhập / đăng kí
        //trường hợp submit với javascript
        if (typeof options.onSubmit === "function") {
          //option mình bấm vào là 1 function thì thực hiện các lệnh trong này

          var enableInputs = formElement.querySelectorAll("[name]"); //select (Lấy) tất cả các input ở trạng thái enble(nhận giá trị nhập vào) có fill là name và không có atribute là disabled(không được tương tác) <:not[disabled]>

          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            //Tất cả các value của form, enableInputs là nodeList và sẽ được form convert sang kiểu array để sử dụng reduce để lấy ra tất cả value của mảng
            switch (input.type) {
              case "radio": //Trường hợp là radio (chọn 1 trong tất cả)
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value; //Lấy value của class nào có đuôi name là checked (đưuọc tích vào)
              case "checkbox": //Trường hợp là checkbox (chọn tùy thích)
                if (!input.matches(":checked")) {
                  //Kiểm tra nếu input không được checked thì trả về values tổng
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  //Kiểm tra nếu value của name input không phải là array thì gán cho nó là 1 array
                  values[input.name] = [];
                }

                values[input.name].push(input.value); //thêm cái input.value vào trong  values tổng
                break;
              case "file": //Trường hợp chọn file
                values[input.name] = input.files; //Trả về 1 fileList để dễ làm
                break;
              default:
                values[input.name] = input.value; // giá trị nhập vào của ô input name = giá trị nhập vào và (&&) return values(vd:return a= 1+2 && a tức là return cả 2 vế đều có kết quả là a = 3)
            }
            return values;
          }, {}); //{} = value = giá trị khởi tạo

          options.onSubmit(formValues); //Trả về các giá trị lấy được (onSubmit ở đây là function được mình tự định nghĩa)
        }
        //Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    //Xử qua mỗi rule và xử lí (lắng nghe sự kiện blur, input, ...)

    options.rules.forEach(function (rule) {
      //lấy từng rule trong rules tổng
      //Lưu lại các rules trong input
      if (Array.isArray(selectorRules[rule.seletor])) {
        //Kiểm tra trong mảng có rule không
        selectorRules[rule.seletor].push(rule.test); //Nếu trong mảng đã có rule  rồi thì thêm phần tử rule tiếp theo vào
      } else {
        selectorRules[rule.seletor] = [rule.test]; //nếu trong mảng chưa có phần tử đó thì có sẽ tạo mảng và gán phần tử đó vào mảng
      }

      var inputElements = formElement.querySelectorAll(rule.seletor); // Lấy input của các element trong form-1

      Array.from(inputElements).forEach(function (inputElement) {
        // chuyển inputElements từ nodeList sang array và tiến hành lấy các phần tử inputElement ở trong ra Xử lý trường hợp blur ra ngoài
        inputElement.onblur = function () {
          //click vào ô input rồi click ra khỏi ô đó(onblur)
          validate(inputElement, rule);
        };

        //Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          //oninput: khi người dùng đang nhập
          var errorElement = getParent(inputElement, options.forGroupSelector).querySelector(options.errorSelector); //Lấy element cha hiện tại rồi từ element đó, kiếm class con là form-message

          errorElement.innerText = "";
          getParent(inputElement, options.forGroupSelector).classList.remove("invalid"); //xóa class
        };
      });
    });
  }
}

//Định nghĩa rules
/*Nguyên tắc của rules (tự định nghĩa):
    1. Khi có lỗi => trả ra message lỗi
    2. Khi hợp lệ => Không trả ra cái gì cả(underfine)
*/

//Xử lý Tên nhập vào
Validator.isRequired = function (seletor, message) {
  return {
    seletor: seletor, //đối số truyền vào
    test: function (value) {
      //kiểm tra người dùng có nhập chưa, nhận 1 value để kiểm tra
      return value ? undefined : message || "(*.)Vui lòng nhập đầy đủ thông tin"; //value.trim() để loại bỏ trường hợp người dùng chỉ nhập dấu cách
    },
  };
};

//Xử lý email nhập vào
Validator.isEmail = function (seletor, message) {
  //email
  return {
    seletor: seletor, //đối số truyền vào
    test: function (value) {
      //kiểm tra email đúng kiểu chưa (search: javascript email regex)
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //kiểm tra có phải email không
      return regex.test(value) ? undefined : message || "(*.)Vui lòng nhập đúng email của bạn";
    },
  };
};

//Xử lý mật khẩu nhập vào
Validator.minLength = function (seletor, min, max, message) {
  //password, truyền vào 1 giá trị và độ dài
  return {
    seletor: seletor, //đối số truyền vào
    test: function (value) {
      return value.length >= min && value.length <= 24
        ? undefined
        : message || `(*.)Vui lòng nhập mật khẩu từ ${min} đến ${max}kí tự`;
    },
  };
};

//Xử lý kiểm tra lại mật khẩu có trùng với mật khẩu ở trên không
Validator.isConfirmed = function (seletor, getConfirmValue, message) {
  // đối số thứ 3 là text mình nhập vào(có thể có hoặc không), dùng trong trường hợp 1 hàm dùng cho nhiều form khác nhau(vì lười),vd như dùng cho cả đăng nhập đăng kí,..
  return {
    seletor: seletor,
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || "(*.)Mật khẩu không khớp,vui lòng nhập lại";
    },
  };
};

//---------------Xử lý API------------------

var infoApi = "http://localhost:3000/informationdk";
var getCurrentUser = localStorage.getItem("currentUser");
var headerNavbarWrapElement = document.querySelector(".header__navbar-wrap");

if (getCurrentUser) {
  let currentUser = JSON.parse(getCurrentUser);
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
} else {
  headerNavbarWrapElement.innerHTML = `
    <div class="header__navbar-item header__navbar-actor">
        <li id="res-form" class="header__navbar-item header__navbar-item--strong header__navbar-item--register">
            Đăng kí
        </li>
        <li id="lg-form" class="header__navbar-item header__navbar-item--strong header__navbar-item--login">
            Đăng nhập
        </li>
    </div>
  `;
}

//-----Đăng ký-----
//Hàm lấy ra kết quả của email kiểm tra để bỏ vào checkEmail
function checkUsers(mail, callback) {
  const data = localStorage.getItem("listUser");
  if (data) {
    const listUser = JSON.parse(data);
    for (const user of listUser) {
      if (user.email === mail) {
        callback(true); // Nếu tìm thấy email, gọi callback(true) và thoát
        return;
      }
    }
  }

  callback(false); // Không tìm thấy email trùng
}

//Hàm tạo ra thông tin mới để bỏ vào database
function createInfo(data, callback) {
  const listUser = localStorage.getItem("listUser");
  if (listUser) {
    const listUserArr = JSON.parse(listUser);
    listUserArr.push(data);
    localStorage.setItem("listUser", JSON.stringify(listUserArr));
  } else {
    localStorage.setItem("listUser", JSON.stringify([data]));
  }
  localStorage.setItem("currentUser", JSON.stringify(data));

  callback();
}

//xử lí form thêm chữ vào form
function handerCreateFormRegister() {
  let resultEmail;
  var createBtnRegister = document.querySelector("#form-submit-register");

  createBtnRegister.onclick = function () {
    var fullname = document.querySelector('input[name="fullname"]').value;
    var email = document.querySelector('input[name="email_register"]').value;
    var password = document.querySelector('input[name="password_register"]').value;
    var password_confirmation = document.querySelector('input[name="password_confirmation"]').value;
    var province = document.querySelector('select[name="province"]').value;

    checkUsers(email, function (info) {
      resultEmail = info;
      return resultEmail;
    });

    setTimeout(function () {
      if (fullname === "" || email === "" || password === "" || password_confirmation === "" || province === "") {
        alert("Vui lòng nhập đầy đủ thông tin");
      } else if (resultEmail) {
        alert("Email đã tồn tại");
      } else if (password !== password_confirmation) {
        alert("Mật khẩu không khớp");
      } else {
        var formData = {
          fullname: fullname,
          email: email,
          password: password,
          province: province,
        };

        createInfo(formData, function () {
          alert("Đăng ký thành công");
          window.location.reload();
        });
      }
    }, 500);
  };
}

//-----Đăng nhập-------
function checkPassword(email, password, callback) {
  const data = localStorage.getItem("listUser");
  if (data) {
    const listUser = JSON.parse(data);
    for (const user of listUser) {
      if (user.email === email) {
        if (user.password === password) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          callback(true); // eamil và pass khớp trong database
          return;
        }
      }
    }
  }

  callback(false); // Không tìm thấy email trùng
}

function handerCreateFormLogin() {
  let resultEmail;
  let resultPass;
  var createBtnLogin = document.querySelector("#form-submit-login");

  createBtnLogin.onclick = function () {
    var email = document.querySelector('input[name="email_Login"]').value;
    var password = document.querySelector('input[name="password_Login"]').value;

    checkUsers(email, function (info) {
      resultEmail = info;
      return resultEmail;
    });

    checkPassword(email, password, function (info) {
      resultPass = info;
      return resultPass;
    });

    setTimeout(function () {
      if (resultEmail) {
        // alert('Có email này')
        if (resultPass) {
          alert("Đăng nhập thành công");
          window.location.reload();
        } else {
          alert("Mật khẩu không chính xác");
        }
      } else {
        alert("Tài khoản không tồn tại");
      }
    }, 500);
  };
}

//Dăng xuất
const logoutBtn = document.querySelector(".header__navbar-user-item--separate");
logoutBtn.onclick = function () {
  localStorage.removeItem("currentUser");
};
