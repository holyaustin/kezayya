/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui';
import { Link } from 'components/link';
import RightArrow from 'components/icons/right-arrow';
import GiftBox from 'components/icons/gift-box';

const data = [
  {
    tld: '.com',
    price: 15,
  },
  {
    tld: '.net',
    price: 14,
  },
  {
    tld: '.org',
    price: 19,
  },
];

const TopBar = () => {
  return (
    <Box as="section" sx={styles.topbar}>
      <Box sx={styles.content}>
        <Text as="span" className="caption">
          <GiftBox /> Cyber monday sale begin, just grave the hot pricing
        </Text>
        <Text as="span" className="tlds">
          {data.map((item, i) => (
            <strong key={i}>
              {item.tld} ${item.price}
            </strong>
          ))}
        </Text>
        <Link path="#">
          See Pricing <RightArrow />
        </Link>
      </Box>
    </Box>
  );
};

export default TopBar;

const styles = {
  topbar: {
    backgroundColor: '#080111',
    px: [6, null, null, null, 0],
    py: ['12px'],
  },
  content: {
    display: ['flex'],
    alignItems: ['center'],
    justifyContent: [null, null, null, 'center', 'unset'],
    color: 'white',
    fontSize: [1],
    fontWeight: 500,
    maxWidth: 780,
    m: '0 auto',
    textAlign: 'center',
    span: {
      '+ span': {
        ml: [4],
      },
    },
    '.caption': {
      display: 'inline-flex',
      alignItems: 'center',

      width: [199, null, null, 'auto'],
      overflow: ['hidden', null, null, 'unset'],
      whiteSpace: ['nowrap', null, null, 'unset'],

      svg: {
        mr: [2, null, null, 3],
        minWidth: 20,
      },
    },
    '.tlds': {
      display: ['none', null, null, null, 'block'],
    },
    strong: {
      fontWeight: 700,
      textTransform: 'uppercase',
      '+ strong': {
        ml: 3,
      },
    },
    a: {
      color: '#87A9FF',
      cursor: 'pointer',
      fontSize: ['13px', null, null, 1, 2],
      fontWeight: 700,
      alignItems: 'center',
      display: 'inline-flex',
      ml: [2, null, null, null, 10, 13],
      svg: {
        ml: 1,
      },
    },
  },
};
