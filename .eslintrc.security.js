module.exports = {
    plugins: ['security'],
    extends: ['plugin:security/recommended'],
    rules: {
        'security/detect-object-injection': 'error',
        'security/detect-non-literal-require': 'error',
        'security/detect-non-literal-fs-filename': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'error',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-no-csrf-before-method-override': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-possible-timing-attacks': 'error'
    },
    env: {
        node: true
    }
};