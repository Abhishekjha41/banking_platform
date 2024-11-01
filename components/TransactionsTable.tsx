import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
   } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
} 

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          // Convert the status to a string if it returns an object
          const status = typeof getTransactionStatus(new Date(t.date)) === 'string'
            ? getTransactionStatus(new Date(t.date))
            : getTransactionStatus(new Date(t.date))|| "Unknown";

          // Ensure amount is formatted as a string
          const amount = formatAmount(t.amount).toString();

          const isDebit = t.type === 'debit';
          const isCredit = t.type === 'credit';
          const displayAmount = isDebit ? `-${amount}` : amount;

          return (
            <TableRow key={t.id} className={`${isDebit || displayAmount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name) || "Unnamed"}
                  </h1>
                </div>
              </TableCell>

              <TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || displayAmount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'
              }`}>
                {displayAmount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={typeof status === 'string' ? status : "Unknown"} /> 
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.date)).dateTime || "Invalid Date"}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24 max-md:hidden">
                {t.paymentChannel || "Unknown"}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={typeof t.category === 'string' ? t.category : "Uncategorized"} /> 
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};



export default TransactionsTable