module.exports = {
    plugins: ['security'],
    extends: ['plugin:security/recommended'],
    rules: {
        'security/detect-object-injection': 'warn',
        'security/detect-non-literal-require': 'error',
        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-eval-with-expression': 'error',
        'security/detect-unsafe-regex': 'warn',
        'security/detect-buffer-noassert': 'warn',
        'security/detect-child-process': 'warn',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-no-csrf-before-method-override': 'warn',
        'security/detect-pseudoRandomBytes': 'warn',
        'security/detect-possible-timing-attacks': 'warn'
    },
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2020
    }
};