# -*- coding: utf-8 -*-
"""KH-H121 1997年国家总预算结算法 — km → en.

源文 OCR 损伤严重：正文可复原，附表金额数字普遍错位、且相互勾稽不成立，
金额一律标注 [figure illegible in source]，不臆造数字。
"""
T = {}


def _a(no, *lines):
    T[str(no)] = "\n".join(lines)


_a(2,
   "- Budget revenue implemented by the National Treasury shall be itemised by ministry and public institution in "
   "Table 3 attached to this Law. Budget expenditure implemented by the National Treasury shall be itemised by "
   "ministry and public institution, approximately and by chapter, in Table 2 attached to this Law.",
   "Table \"3\" attached to this Law is the list of public investment projects financed from domestic sources "
   "which were decided during the period of management of the year 1997 and which are arranged approximately by "
   "ministry and public institution.",
   "The summary report of achievements on public investment financed from abroad in respect of debt shall be "
   "itemised by budget content, and in respect of expenditure shall be itemised approximately by ministry and "
   "public institution, and shall be incorporated consecutively in Tables \"3\" and \"1\" attached to this Law.",
   "Table \"12\" attached to this Law is the list of public investment projects financed from abroad otherwise "
   "than from the national treasury, which were decided during the period of management of the year 1997 and "
   "which are arranged approximately by ministry and public institution by foreign donor.")

_a(4,
   "General budget expenditure of the State provided for in the Law on Financial Regime for the Management of "
   "the Year 1997 amounts to a total of [figure illegible in source] million riels; the amount implemented was "
   "[figure illegible in source] million riels, so that there is a saving of credit of [figure illegible in "
   "source] million riels. The balance of the implementation of the public investment programme / projects is as "
   "follows: - Programme — [figure illegible in source] million riels; - Implementation — [figure illegible in "
   "source] million riels; - Available saving — [figure illegible in source] million riels. Public investment "
   "financed by domestic financing: - Implementation — [figure illegible in source] million riels; - "
   "Consequently there is a shortfall of [figure illegible in source] million riels. Capital of debt repayment: "
   "- Implementation — [figure illegible in source] million riels; - Consequently there is a saving of [figure "
   "illegible in source] million riels.")

_a(5,
   "- The implementation of the revenue and expenditure operations of the budget for the management of the year "
   "1997 achieved by the National Treasury, as specified in Article 3 and Article 4 above, has produced the "
   "following result of revenue over expenditure: - Budget revenue achieved by the National Treasury for the "
   "management of the year 1997 [figure illegible in source];",
   "- Budget expenditure achieved by the National Treasury for the management of the year 1997 [figure "
   "illegible in source];",
   "- The surplus of revenue over expenditure [figure illegible in source] million riels. This surplus of "
   "revenue is the result of investment [figure illegible in source] (+) million riels and the remainder held in "
   "account [figure illegible in source] (-) million riels. In accordance with the provisions of Article 97 of "
   "the Law on the Financial Regime promulgated by Royal Decree No. 01 NS/93 dated 24 December 1993, the amount "
   "of surplus of revenue over expenditure for the management of the year 1997, being [figure illegible in "
   "source] million riels, shall be kept in the account opened within the National Treasury.",
   "Chapter 3 Provisions on Public Investment Financed from Abroad Directly Implemented outside the National "
   "Treasury")

_a(6,
   ".",
   "Public investment financed from abroad directly implemented outside the National Treasury, for which revenue "
   "shall be recorded so that total revenue equals total expenditure for the management of the year 1997, "
   "amounts to",
   "an implemented amount of [figure illegible in source] million riels. Chapter 4 Provisions on",
   "the Balance of Public Finances for the Management of the Year 1997")

_a(7,
   "The financial operations of the State have achieved: - The operations of general budget revenue of the State "
   "(Table \"1\") and the operations of expenditure",
   "of the general budget of the State (Table \"1\"); - The operations of public investment",
   "recorded as the balance of the finances of the State with the National Bank of Cambodia, as set out in Table "
   "1 below:",
   "1 - Domestic revenue [figure illegible in source]",
   "1.1 - Recurrent domestic revenue [figure illegible in source]",
   "1.2 - Non-recurrent domestic revenue [figure illegible in source]; 2 - Expenditure [figure illegible in "
   "source]",
   "2.1 - Recurrent expenditure [figure illegible in source]",
   "2.2 - Capital expenditure, of which: public investment financed from domestic sources — [figure illegible "
   "in source]; budget support fund — [figure illegible in source]; national investment (construction, "
   "equipment) — [figure illegible in source]; expenditure within the country on projects financed by China "
   "(grant aid) — [figure illegible in source]; from the reserve fund — [figure illegible in source]; public "
   "investment financed from abroad (grant aid) — [figure illegible in source]; surplus of the recurrent budget "
   "— (+) [figure illegible in source]; deficit of the general budget — (-) [figure illegible in source]; "
   "financing of the deficit — [figure illegible in source]",
   "3.1 - Foreign financing [figure illegible in source]: - Budget support aid without project identification — "
   "[figure illegible in source]; - Budget support aid with project identification — [figure illegible in "
   "source]; - Project aid — [figure illegible in source]; - Repayment of foreign debt — (-) [figure illegible "
   "in source]",
   "3.2 - Domestic financing — (-) [figure illegible in source]: - Bank financing — (-) [figure illegible in "
   "source]; - Repayment of domestic debt — (-) [figure illegible in source]; - Deposits and other financial "
   "operations of the National Treasury — [figure illegible in source]. Debt repayment operations amount to "
   "[figure illegible in source] million riels.",
   "Consequently, there is a positive balance with respect to recurrent expenditure of (+) [figure illegible in "
   "source] million riels.",
   "In the month of January, the credit position of [amount illegible] million riels shall be used by the "
   "Government.",
   "40",
   "Chapter 5 Miscellaneous Provisions")

_a(8,
   "- Any provisions contrary to this Law shall be considered null and void.",
   "Phnom Penh, [day and month illegible] 1999, in the Royal Name and in accordance with the Royal Presentation",
   "respectfully submitted to the Head of State, requesting the Royal signature of His Majesty the King — "
   "[signature]; Signature: Hun Sen. Submitted to Samdech Prime Minister, Senior Minister and Minister of "
   "Economy and Finance, No. [illegible], signature, for distribution — Phnom Penh, [date illegible] 1999.",
   "[Illegible in source]")
