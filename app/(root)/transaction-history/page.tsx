import HeaderBox from '@/components/HeaderBox';
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react';

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  
  const currentPage = Number(page) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts || !accounts.data || accounts.data.length === 0) return <p>No accounts found</p>;

  const accountsData = accounts.data;
  const appwriteItemId = id || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });

  if (!account || !account.transactions) return <p>Account or transactions not found</p>;

  // Destructuring account data with safety checks
  const {
    name = 'Account',
    officialName = 'Official Account Name',
    mask = 'XXXX',
    currentBalance = 0,
  } = account.data || {};

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = Array.isArray(account.transactions)
    ? account.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
    : [];

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">{name}</h2>
            <p className="text-14 text-blue-25">
              {typeof officialName === 'string' ? officialName : 'Official Account Name'}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {typeof mask === 'string' ? mask : 'XXXX'}
            </p>
          </div>
          
          <div className='transactions-account-balance'>
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          {/* <TransactionsTable transactions={currentTransactions} /> */}
          <div className="my-4 w-full">
            <Pagination totalPages={totalPages} page={currentPage} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
