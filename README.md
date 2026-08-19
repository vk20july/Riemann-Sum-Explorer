# Riemann Sums → Definite Integrals

An interactive mathematics visualization that helps students understand how a **definite integral can be approximated using Riemann sums**.

This project was developed as part of the **Web Developer Internship Hiring Assessment**. The assignment asks candidates to create an interactive Class 11/12 Mathematics or Physics simulation that makes a difficult concept intuitive through dynamic controls, visual feedback, and an “Aha!” moment.

> **Selected topic:** Riemann Sums converging to Integrals

---

## 1. Project Overview

The purpose of this project is to make the connection between **Riemann sums and definite integrals** visually understandable rather than presenting the concept only through formulas.

The application allows the learner to:

- Select different mathematical functions.
- Change the number of rectangles used for approximation.
- Choose between Left, Midpoint, and Right sampling.
- Change the integration interval.
- See the function and Riemann rectangles update dynamically.
- Compare the numerical approximation with the exact integral.
- Observe the approximation error.
- Play a convergence animation in which the number of rectangles increases.
- View a convergence table showing how the approximation changes as `n` increases.
- Switch between light and dark themes.

The central idea presented by the application is:

$$
\int_a^b f(x)\,dx \approx \sum_{i=1}^{n} f(x_i)\Delta x
$$

As the number of rectangles increases, their width decreases and the Riemann-sum approximation approaches the exact integral.

---

## 2. Why Riemann Sums?

A definite integral can be understood as the limiting value of a sum of many small areas.

For an interval `[a, b]` divided into `n` rectangles:

$$
\Delta x = \frac{b-a}{n}
$$

A Riemann sum approximates the area using:

$$
\sum_{i=1}^{n} f(x_i)\Delta x
$$

When `n` becomes larger:

$$
n \uparrow \quad \Rightarrow \quad \Delta x \downarrow
$$

and the approximation becomes increasingly close to:

$$
\int_a^b f(x)\,dx
$$

The application is designed to let the learner **see this convergence happen**.

---

## 3. The “Aha!” Moment

The key learning moment of the project is:

```text
More rectangles
       ↓
Smaller rectangle width
       ↓
Better approximation
       ↓
Riemann sum converges
       ↓
Definite integral
```

The **Play convergence** interaction demonstrates this visually by increasing the rectangle count through:

```text
2 → 4 → 8 → 16 → 32 → 64 → 100
```

At the same time, the application updates the graph, approximation, and error values.

This allows the learner to connect the visual change in the rectangles with the mathematical idea of convergence.

---

## 4. Functions Included

The application provides three functions for experimentation.

### Quadratic

$$
f(x)=x^2
$$

### Sine

$$
f(x)=\sin(x)
$$

### Linear

$$
f(x)=2x+1
$$

Each function has an associated exact integral calculation, allowing the application to compare the Riemann-sum approximation with the exact result.

---

## 5. Riemann Sum Methods

The learner can select three sampling methods.

### Left Riemann Sum

The rectangle height is determined by the function value at the **left endpoint** of each subinterval.

$$
x_i=a+i\Delta x
$$

### Midpoint Riemann Sum

The rectangle height is determined by the function value at the **midpoint**.

$$
x_i=a+\left(i+\frac12\right)\Delta x
$$

### Right Riemann Sum

The rectangle height is determined by the function value at the **right endpoint**.

$$
x_i=a+(i+1)\Delta x
$$

This lets learners compare how different sampling rules affect the approximation.

---

## 6. Main Interactive Features

### Dynamic Rectangle Count

A slider allows the learner to change the number of rectangles.

As `n` increases:

- `Δx` becomes smaller.
- More rectangles are displayed.
- The staircase approximation follows the curve more closely.
- The approximation error generally decreases.

### Dynamic Integration Interval

The learner can modify:

- Start point `a`
- End point `b`

The application recalculates the rectangle width and area approximation based on the selected interval.

### Live Graph

The graph displays:

- The mathematical function.
- The Riemann rectangles.
- The coordinate axes.
- The current rectangle count.
- A legend distinguishing the function from the rectangles.

The graph updates whenever the controls change.

### Approximation, Exact Value & Error

The control panel displays:

- `Δx`
- Approximation
- Exact value
- Error

The absolute error is calculated as:

$$
|\text{Approximation}-\text{Exact Value}|
$$

This connects the visual demonstration to measurable numerical accuracy.

### Convergence Animation

The **Play convergence** button starts the approximation at a small number of rectangles and progressively increases the count.

The learner can observe convergence instead of only reading about it.

### Convergence Lab

The project also provides numerical results for multiple rectangle counts:

```text
n = 2
n = 4
n = 8
n = 16
n = 32
n = 64
n = 100
```

For each value of `n`, the application calculates:

- Approximation
- Error

This provides numerical evidence of the convergence seen in the graph.

---

## 7. Technical Implementation

### Technologies

- **React**
- **JavaScript / JSX**
- **HTML**
- **CSS**
- **SVG** for the interactive mathematical graph

### React

React is used to manage the interactive application state, including:

- Selected function
- Rectangle count
- Sampling method
- Integration interval
- Theme
- Animation state
- Animation speed
- Results visibility

### SVG

SVG is used to render the mathematical visualization.

The graph dynamically generates:

- Function curves
- Riemann rectangles
- Axes
- Grid lines
- Labels

Using SVG makes the visualization scalable and allows the graph to respond immediately to user input.

### State-driven interaction

The graph and numerical values are derived from the current application state. When the user changes a control, the relevant calculations are performed again and the visualization updates.

---

## 8. Core Calculation Logic

The Riemann approximation is calculated using:

$$
\text{Approximation}=\sum_{i=1}^{n} f(x_i)\Delta x
$$

where:

$$
\Delta x = \frac{b-a}{n}
$$

For each rectangle, the application determines the sampling point according to the selected method:

```text
Left     → left endpoint
Midpoint → middle of interval
Right    → right endpoint
```

The function value at that sampling point is multiplied by `Δx` and added to the running total.

The application then compares the resulting approximation with the exact integral.

---

## 9. User Flow

1. Select a mathematical function.
2. Choose Left, Midpoint, or Right sampling.
3. Set the integration interval.
4. Adjust the number of rectangles.
5. Observe the rectangles on the graph.
6. Compare the Approximation and Exact values.
7. Check the Error.
8. Press **Play convergence**.
9. Watch the number of rectangles increase.
10. Observe how the approximation approaches the exact integral.
11. Review the convergence table.

This flow moves from **visual intuition → interaction → numerical verification → mathematical understanding**.

---

## 10. How This Meets the Assignment Requirements

The assignment emphasizes mathematical/scientific rigor, pedagogical depth, an “Aha!” moment, dynamic interaction, and UI/UX.

### Mathematical / Scientific Rigor

The project demonstrates:

- Riemann-sum approximation.
- Rectangle width `Δx`.
- Left, Midpoint, and Right sampling.
- Exact integral comparison.
- Approximation error.
- Convergence as the number of rectangles increases.

### Pedagogical Depth

The project does not only display the answer. It allows the learner to manipulate the variables and see how the result changes.

The central teaching idea is:

> **A sum of many small rectangle areas approaches the area represented by the definite integral.**

### “Aha!” Moment

The convergence animation makes the relationship between:

```text
Σ  →  ∫
```

visible by progressively increasing the number of rectangles.

### UI / UX

The interface provides:

- Clear sections.
- Interactive controls.
- Immediate visual feedback.
- Numerical feedback.
- Light/dark theme.
- Responsive layout.
- A dedicated convergence section.

---

## 11. AI Usage Disclosure

AI tools were used during development as permitted by the assignment.

### How AI was used

AI assistance was used for:

- Discussing the structure of the interactive visualization.
- Generating and refining portions of the React/JavaScript implementation.
- Improving naming and code organization.
- Reviewing the mathematical explanation and user flow.
- Identifying possible implementation issues and improving the UI/UX.

### Human validation and decisions

The generated suggestions were reviewed and adapted to the requirements of the assignment.

Particular attention was given to validating:

- The Riemann-sum calculation.
- Left, Midpoint, and Right sampling logic.
- Rectangle width calculation.
- Exact integral comparison.
- Error calculation.
- Convergence behavior.
- Synchronization between the controls, graph, and numerical results.

AI was used as a development assistant rather than as a substitute for understanding the mathematical concept or validating the final implementation.

---

## 12. Running the Project Locally

### Prerequisites

- Node.js
- npm
- Git

### Installation

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
npm install
npm run dev
```

Open the local URL provided by the development server in your browser.

> If your project uses a different build command or setup, use the commands specified in your `package.json`.

---

## 13. Project Structure

```text
riemann-sums/
│
├── index.html
├── package.json
├── README.md
│
└── src/
    ├── main.jsx
    └── styles.css
```

| File | Purpose |
|---|---|
| `index.html` | HTML entry point |
| `main.jsx` | React application, calculations, state, and SVG visualization |
| `styles.css` | Layout, styling, responsive design, themes, and UI components |
| `README.md` | Project documentation |

---

## 14. Live Demo

**Live Demo:**  
`https://vk20july.github.io/Riemann-Sum-Explorer/`

## 15. GitHub Repository

**GitHub:**  
`https://github.com/vk20july/Riemann-Sum-Explorer`

---

## 16. Future Improvements

Possible improvements include:

- Add more mathematical functions.
- Add numerical integration methods for comparison.
- Display the exact area directly on the graph.
- Add zoom and pan controls.
- Allow Left, Midpoint, and Right sums to be compared simultaneously.
- Add tooltips explaining individual rectangles.
- Add a guided learning mode.
- Add additional calculus topics such as the Trapezoidal Rule and Fundamental Theorem of Calculus.

---

## 17. Conclusion

This project demonstrates that a definite integral is not just an abstract formula.

By allowing the learner to manipulate the number of rectangles and watch the approximation converge, the application connects:

$$
\boxed{\text{Rectangles}}
\rightarrow
\boxed{\text{Riemann Sum}}
\rightarrow
\boxed{\text{Convergence}}
\rightarrow
\boxed{\text{Definite Integral}}
$$

The goal is to make the mathematical concept **interactive, visual, and intuitive**.
