window.onload = () => {
    if (window.location.href.includes('#cadastro')) {
        form();
    }
}
const form = () => {
    let email = document.getElementById('email');
    let cpf = document.getElementById('cpf');
    let text = document.querySelector('.inputs p');
    let button = document.querySelector('.inputs button');

    email.classList.toggle('select');
    cpf.classList.toggle('select');
    text.classList.toggle('select');
    button.classList.toggle('select');

    if (text.classList == 'select') {
        text.innerHTML = 'Fazer login...';
        window.location.href = 'login.php#cadastro'
    } else {
        text.innerHTML = 'Cadastrar...';
        window.location.href = 'login.php#login'
    }
    if (button.classList == 'select') {
        button.innerHTML = 'Cadastrar';
    } else {
        button.innerHTML = 'Login';
    }
}

const validate = () => {
    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;
    
    if (user == 'admin' | pass == 'admin') {location.href = '../funcionario/funcionario.php'}
}