import * as http from './http';

const getFieldValue = (fieldId: string) => {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (!field) {
        return null;
    }
    return field.value;
};

const getUser = () => {
    return {
        name: getFieldValue('username'),
        password: getFieldValue('password')
    };
};

const login = (user: any) => http.post('/api/login', { name: user.name, password: user.password }).then(data => {
    if (!data) {
        throw new Error(`empty login response`);
    }
    return data;
});

const doLogin = () => login(getUser()).then(data => {
    if (data.error) {
        const element = document.getElementById('error');
        if (!element) {
            return;
        }
        // tslint:disable-next-line:no-expression-statement
        element.innerText = 'Error: ' + data.error;
        return;
    }
    const token = data.token;
    // tslint:disable-next-line:no-expression-statement
    window.sessionStorage.setItem('token', token);
    // tslint:disable-next-line:no-expression-statement
    window.location.href = 'index.html';
});

const doLoginBtn = document.getElementById('do_login');
if (doLoginBtn) {
    // tslint:disable-next-line:no-expression-statement
    doLoginBtn.addEventListener('click', () => doLogin());
}
