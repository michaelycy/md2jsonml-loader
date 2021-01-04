module.exports = {
  hooks: {
    'commit-msg': 'echo "校验 commit 信息" && commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'echo "代码格式化" && lint-staged',
    // 'pre-push': 'lint-staged'
  },
};
