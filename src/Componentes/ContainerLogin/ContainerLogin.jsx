import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ContainerLogin/ContainerLogin.css";
import logo from "../../Assets/Imagens/CodeAcademyLogoSemFundo.png";
import google from "../../Assets/Imagens/SignGoogle.png";
import { useCookies } from "react-cookie";
//criar um objeto user logo no inicio

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();

    //Este estado, da linha 17:19, define o nome do site lá na aba de cima, não precisa estar em todas as páginas, apenas no APP, uma vez que o site possui apenas um nome, e não vários. Isso evitará de confundir o usuário.
    //Farei esta alteração em todas a página que encontrar este useEffect, e não mudem, PFV.

    // useEffect(() => {
    //     document.title = "Login";
    // }, []);

    useEffect(() => {
        if (cookies["user-info"]) {
            const userTag = cookies["user-info"]?.tag;

            if (userTag === "professor") {
                navigate("/professors");
            } else {
                navigate("/catalogoDeCursos");
            }
        }
    }, [navigate, cookies]);

    const handleLogin = React.useCallback(
        async (event) => {
            event.preventDefault();

            try {
                const response = await fetch(
                    `http://localhost:3001/usuarios?email=${email}&senha=${password}`
                );
                const data = (await response.json())[0];

                if (!data.length) {
                    setFailedLogin(true);
                    setPassword("");
                }

                console.log(data);

                setCookie("user-info", {
                    id: data?.id,
                    nome: data?.nome,
                    email: data?.email,
                    tag: data?.tag,
                });

                if (data?.tag === "aluno") {
                    navigate("/professors");
                } else {
                    navigate("/catalogoDeCursos");
                }
            } catch (error) {
                console.error("Erro ao obter dados dos usuários:", error);
                alert("Ocorreu um erro ao tentar fazer login.");
            }
        },
        [email, navigate, password, setCookie]
    );

    return (
        <>
            <div className="centered-container-login">
                <div className="container">
                    <div>
                        <img src={logo} alt="Logo Code Academy" />
                        <h2>Login</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Digite seu E-mail:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Digite seu E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {failedLogin && (
                            <p>
                                <strong>Usuário</strong> ou{" "}
                                <strong>senha</strong> inválido. Por favor,
                                verifique as informações e tente novamente.
                            </p>
                        )}

                        <input
                            type="submit"
                            value="Entrar"
                            className="button_login"
                            style={{ marginBottom: "0px" }}
                        />
                        <button
                            type="button"
                            className="button_registrar_login"
                            style={{ backgroundColor: "#808080fc" }}
                            onClick={() => navigate("/cadastro")}
                        >
                            Cadastrar-se
                        </button>
                    </form>
                    <div className="Sign_modes">
                        <img src={google} alt="Logo Code Academy" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
