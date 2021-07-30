import React, { useState, useEffect } from 'react';
import web3 from './web3';
import lottery from './lottery';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onMount = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };
    onMount();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const winner = await lottery.methods.winner().call();

    setMessage(`A winner has been picked: ${winner}`);
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}
        There are currently {players.length} people entered to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label htmlFor=''>Amount of ether to enter</label>
          <input
            type='text'
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>

      <hr />
      <h1>{message}</h1>
    </div>
  );
};

export default App;
