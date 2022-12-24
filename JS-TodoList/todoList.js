// 將重複的api拉出來
const apiUrl = 'https://todoo.5xcamp.us';

// 顯示畫面
const register = document.querySelector('.register');
const logIn = document.querySelector('.logIn');
const todoList = document.querySelector('.todoList');
// 註冊、登入畫面按鈕
const registerBtn = document.querySelector('.registerBtn');
const logInBtn = document.querySelector('.logInBtn');
// 註冊、登入按鈕 & 值
const logInAccount = document.querySelector('.logInAccount');
const registerAccount = document.querySelector('.registerAccount');
const AccountMsg = Array.from(document.querySelectorAll('.AccountMsg'));
// todoList
const logOutBtn = document.querySelector('.logOutBtn');
const yourName = document.querySelector('.yourName');
const list = document.querySelector('.list');
const txt = document.querySelector('.txt');
const save = document.querySelector('.save');

//設置一個存放 token的地方
let token = '';

if (localStorage.getItem('tokenKey') !== null) {
	console.log('現在是登入狀態，直接幫忙登入');
	alert('登入成功');
	tokenAlready();
} else {
	console.log('localstorage還未存在帳密&token');
}

// 判斷是否有token，如果是登入狀態就直接拿取已存在logcalstorage的值來登入
function tokenAlready() {
	let accountPssword = JSON.parse(localStorage.getItem('accountPssword'));
	axios
		.post(
			`${apiUrl}/users/sign_in`,
			{
				user: accountPssword,
			},
			{
				headers: {
					authorization: token,
				},
			}
		)
		.then((res) => {
			console.log(res);
			token = res.headers.authorization;
			register.classList.add('none');
			todoList.classList.remove('none');
			logIn.classList.add('none');
			yourName.textContent = ` ${res.data.nickname} 的待辦清單`;
			localStorage.setItem('tokenKey', token);
			localStorage.setItem('accountPssword', JSON.stringify(accountPssword));
			showTodo();
		})
		.catch((error) => {
			console.log(error);
		});
}

// 畫面抓取
function render(e) {
	// console.log(e.target.value);
	if (e.target.className === 'registerBtn') {
		// console.log('這是要呈現註冊畫面的按鈕');
		register.classList.remove('none');
		logIn.classList.add('none');
		todoList.classList.add('none');
	} else if (e.target.className === 'logInBtn') {
		// console.log('這是要呈現登入畫面');
		register.classList.add('none');
		todoList.classList.add('none');
		logIn.classList.remove('none');
	} else {
		return;
	}
}

// 註冊帳號 function
function creatAccount() {
	let email = AccountMsg[0].value;
	let nickname = AccountMsg[1].value;
	let password = AccountMsg[2].value;
	let passwordAgain = AccountMsg[3].value;
	console.log(AccountMsg[0].value);
	if (email == '' || nickname == '' || password == '' || passwordAgain == '') {
		alert('請假查內容是否都有填寫');
		return;
	} else if (password.length < 6) {
		alert('密碼強度不夠，只少6碼');
		return;
	} else if (password !== passwordAgain) {
		alert('再次輸入密碼不一致');
		return;
	} else {
		axios
			.post(`${apiUrl}/users`, {
				user: {
					email: email,
					nickname: nickname,
					password: password,
				},
			})
			.then((res) => {
				console.log(res);
				alert(res.data.message);
				register.classList.add('none');
				todoList.classList.add('none');
				logIn.classList.remove('none');
			})
			.catch((error) => {
				console.log(error.response);
				alert('請檢查email是否符合格式');
			});
	}
}

// 登入function
function logAccount() {
	if (AccountMsg[4].value == '' || AccountMsg[5].value == '') {
		alert('請輸入帳號密碼');
		return;
	} else {
		let accountPssword = {
			email: AccountMsg[4].value,
			password: AccountMsg[5].value,
		};
		axios
			.post(
				`${apiUrl}/users/sign_in`,
				{
					user: accountPssword,
				},
				{
					headers: {
						authorization: token,
					},
				}
			)
			.then((res) => {
				console.log(res);
				token = res.headers.authorization;
				register.classList.add('none');
				todoList.classList.remove('none');
				logIn.classList.add('none');
				yourName.textContent = ` ${res.data.nickname} 的待辦事項`;
				localStorage.setItem('tokenKey', token);
				localStorage.setItem('accountPssword', JSON.stringify(accountPssword));
				showTodo();
			})
			.catch((error) => {
				console.log(error);
				alert('密碼或帳號不正確');
			});
	}
}

// 登出畫面
function logOutAccountFn() {
	axios
		.delete(`${apiUrl}/users/sign_out`, {
			headers: {
				authorization: token,
			},
		})
		.then((res) => {
			alert('已成功登出');
			todoList.classList.add('none');
			logIn.classList.remove('none');
			localStorage.clear();
			location.reload();
		})
		.catch((error) => console.log(error.response));
}

// 取出todoList
function showTodo() {
	let str = '';
	axios
		.get(`${apiUrl}/todos`, {
			headers: {
				authorization: token,
			},
		})
		.then((res) => {
			let todoAry = res.data.todos;
			let unDoList = [];
			console.log(todoAry);
			todoAry.forEach((item) => {
				// 檢查item.completed_at 狀態來決定是否打勾
				if (item.completed_at == null) {
					str += `<li ><input data-id=${item.id} type='checkbox' class='checkbox' >${item.content}<span data-id=${item.id} class='material-symbols-outlined delete'>close</span></li>
					`;
					unDoList.push('1');
				} else {
					str += `<li  style="text-decoration: line-through"><input data-id=${item.id} type='checkbox' class='checkbox' checked>${item.content}<span data-id=${item.id} class='material-symbols-outlined delete'>close</span></li>`;
				}
			});

			list.innerHTML = str;
		})
		.catch((error) => {
			console.log(error.response);
		});
}

// 新增todoList
function addTodoList() {
	let txtValue = txt.value;
	axios
		.post(
			`${apiUrl}/todos`,
			{
				todo: {
					content: txtValue,
				},
			},
			{
				headers: {
					authorization: token,
				},
			}
		)
		.then((res) => {
			console.log(res);
			showTodo();
		})
		.catch((error) => console.log(error.response));
}

// 刪除todoList & toggle todoList
function deleteTodoList(e) {
	let id = e.target.dataset.id;
	if (e.target.getAttribute('class') === 'checkbox') {
		axios
			.patch(
				`${apiUrl}/todos/${id}/toggle`,
				{},
				{
					headers: {
						authorization: token,
					},
				}
			)
			.then((res) => {
				console.log(res);
				if (res.data.completed_at != null) {
					const listOne = e.target.parentElement;
					listOne.style.textDecoration = 'line-through';
				} else {
					const listOne = e.target.parentElement;
					listOne.style.textDecoration = null;
				}
			})
			.catch((error) => {
				console.log(error.response);
			});
	} else if (e.target.getAttribute('class') === 'material-symbols-outlined delete') {
		axios
			.delete(`${apiUrl}/todos/${id}`, {
				headers: {
					authorization: token,
				},
			})
			.then((res) => {
				console.log(res);
				showTodo();
			})
			.catch((error) => {
				console.log(error.response);
			});
	} else {
		return;
	}
}

// 切換畫面按鈕
registerBtn.addEventListener('click', render);
logInBtn.addEventListener('click', render);
// 註冊、登入按鈕
registerAccount.addEventListener('click', creatAccount);
logInAccount.addEventListener('click', logAccount);
// 登出按鈕
logOutBtn.addEventListener('click', logOutAccountFn);
// 新增代辦按鈕
save.addEventListener('click', addTodoList);
// 刪除todoList & toggle todoList
list.addEventListener('click', deleteTodoList);
