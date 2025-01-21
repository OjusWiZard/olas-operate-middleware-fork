import { Flex, Typography } from 'antd';

import { InfoTooltip } from '@/components/InfoTooltip';
import { UNICODE_SYMBOLS } from '@/constants/symbols';

const { Paragraph, Text } = Typography;

const TOOLTIP_STYLE = { width: '400px' };

export const TenderlyAccessTokenLabel = () => (
  <Flex align="center" gap={8}>
    <Text>Tenderly access token</Text>
    <InfoTooltip placement="bottom" overlayInnerStyle={TOOLTIP_STYLE}>
      <Paragraph className="text-sm mt-0">
        The Tenderly access token allows your agent to interact with Tenderly’s
        simulation tools, helping it analyze and optimize bridge and swap
        routes.
      </Paragraph>
      <Paragraph className="text-sm m-0">
        To locate your personal access token:
      </Paragraph>
      <ol className="pl-16 text-sm">
        <li>
          <Text className="text-sm">
            Log in to{' '}
            <a target="_blank" href="https://tenderly.co">
              Tenderly&nbsp;
              {UNICODE_SYMBOLS.EXTERNAL_LINK}
            </a>{' '}
            and click on your profile photo.
          </Text>
        </li>
        <li>
          <Text className="text-sm">
            Go to{' '}
            <span className="font-weight-600">
              Account Settings → Access Tokens.
            </span>
          </Text>
        </li>
      </ol>
    </InfoTooltip>
  </Flex>
);

export const TenderlyAccountSlugLabel = () => (
  <Flex align="center" gap={8}>
    <Text>Tenderly account slug</Text>
    <InfoTooltip placement="bottom" overlayInnerStyle={TOOLTIP_STYLE}>
      <Paragraph className="text-sm m-0">
        The account slug is a unique identifier for your Tenderly account that
        represents your username. You can find your account slug in your
        Tenderly project settings.
      </Paragraph>
    </InfoTooltip>
  </Flex>
);

export const TenderlyProjectSlugLabel = () => (
  <Flex align="center" gap={8}>
    <Text>Tenderly project slug</Text>
    <InfoTooltip placement="bottom" overlayInnerStyle={TOOLTIP_STYLE}>
      <Paragraph className="text-sm m-0">
        The project slug is a unique identifier for each project in Tenderly.
        It’s automatically generated from your project’s name. You can find your
        account slug in your Tenderly project settings.
      </Paragraph>
    </InfoTooltip>
  </Flex>
);

export const CoinGeckoApiKeyLabel = () => (
  <Flex align="center" gap={8}>
    <Text>CoinGecko API key</Text>
    <InfoTooltip placement="bottom" overlayInnerStyle={TOOLTIP_STYLE}>
      <Paragraph className="text-sm mt-0">
        The CoinGecko API key enables your agent to fetch real-time price data,
        ensuring accurate investment calculations.
      </Paragraph>
      <Paragraph className="text-sm m-0">To locate your API key:</Paragraph>
      <ol className="pl-16 text-sm">
        <li>
          <Text className="text-sm">
            Log in to your{' '}
            <a target="_blank" href="https://www.coingecko.com">
              CoinGecko account&nbsp;
              {UNICODE_SYMBOLS.EXTERNAL_LINK}
            </a>
            .
          </Text>
        </li>
        <li>
          <Text className="text-sm">
            Go to <span className="font-weight-600">Developer Dashboard.</span>
          </Text>
        </li>
        <li>
          <Text className="text-sm">
            Find your key under the{' '}
            <span className="font-weight-600">My API Keys</span> section.
          </Text>
        </li>
      </ol>
    </InfoTooltip>
  </Flex>
);
