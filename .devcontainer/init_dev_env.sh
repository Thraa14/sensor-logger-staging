echo "Installing oh my zsh..."
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
sed -i "s/plugins=(.*)/plugins=(git zsh-autosuggestions)/g" ~/.zshrc
echo "alias babel-node=node_modules/.bin/babel-node"
source ~/.zshrc
echo "Please change your default shell:\nsudo chsh -s \$USER \$(which zsh) "
