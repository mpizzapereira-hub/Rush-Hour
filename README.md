# 📄 Documentação: Fluxo Vital - O Enigma da Travessia

O jogo **Fluxo Vital: O Enigma da Travessia** foi desenvolvido com uma interface moderna estilo *Glassmorphism*, focada na conscientização do tráfego através de mecânicas de quebra-cabeça inspiradas em *Rush Hour*.

## 🛠️ Tecnologias Utilizadas
*   **HTML5** para estrutura.
*   **CSS3** com efeitos Glassmorphism, Neon Glow e animações para um visual premium.
*   **JavaScript (Vanilla)** para a lógica da grade $6 \times 6$, movimentos Drag & Drop, controle de Stress e verificação de Zona de Segurança (Zeca Farol).

---

## 🎲 Mecânicas Principais Implementadas

### 🛡️ Sistema Zeca Farol (Zona de Segurança)
Os carros e ônibus não podem travar em uma posição que esteja diretamente à frente ou atrás de outro elemento (pedestre, ciclista ou outro veículo).
*   Se tentar posicionar fora da zona segura ou colidir, o Stress aumenta e a peça volta à posição original.

### 🌡️ Medidor de Stress (Condição de Derrota)
*   **Valor Inicial:** 0%
*   **Incremento:** Violações de segurança ou colisões adicionam **+15%**.
*   **Nó no Trânsito:** Ao atingir 100%, a fase reinicia.
*   **Visual Dinâmico:** LEDs do Zeca Farol mudam de Verde $\rightarrow$ Amarelo $\rightarrow$ Vermelho conforme o Stress sobe.

### 🌦️ Cartas de Evento
*   **Fase 1 (Fluxo Normal):** Distância de segurança de **1 quadro**.
*   **Fase 2 (Dia de Chuva):** Distância de segurança sobe para **2 quadros**, forçando mais cautela.

---

## 🚀 Como Jogar

1.  Acesse a pasta `Rush Hour` no local de desenvolvimento.
2.  Abra o arquivo `index.html` em qualquer navegador.
3.  Clique em **Iniciar Jornada** para ligar o Zeca Farol.
4.  **Arraste** os pedestres para os caminhos livres e os carros de acordo com seu **eixo** ($V$ ou $H$).
5.  Guie o **Pedestre (Nível 1)** ou **Ônibus (Nível 2)** até o ponto de destino marcado com a bandeira verde.

---

## 📁 Estrutura de Arquivos
*   `index.html`: Dashboard, Grid Visual e Modais.
*   `style.css`: Estilização Glass e Neon Glow.
*   `game.js`: Controle da Grade $6 \times 6$, Lógica de Arrastar e Validação de Regras.
