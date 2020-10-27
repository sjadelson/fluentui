import * as React from 'react';
import { ImageIcon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { css } from '@fluentui/react/lib/Utilities';
import { TestImages } from '@fluentui/example-data';

const classNames = mergeStyleSets({
  image: {
    display: 'inline-block',
    position: 'relative',
  },
  one: {
    width: 48,
    height: 44,
    marginLeft: 27,
  },
  oneImage: {
    left: -6,
    top: -4,
  },
  check: {
    width: 35,
    height: 43,
    marginLeft: 55,
  },
  checkImage: {
    left: -60,
    top: -5,
  },
  lock: {
    width: 35,
    height: 42,
    marginLeft: 65,
  },
  lockImage: {
    width: -109,
    top: -5,
  },
});

export const IconImageSheetExample: React.FunctionComponent = () => {
  // ImageIcon is an optimized variant of standard Icon.
  // You could also use the standard Icon here (adding the prop `iconType={IconType.image}`).
  return (
    <div>
      <ImageIcon
        className={classNames.one}
        imageProps={{
          src: TestImages.iconOne,
          className: css(classNames.image, classNames.oneImage),
        }}
      />
      <ImageIcon
        className={classNames.check}
        imageProps={{
          src: TestImages.iconOne,
          className: css(classNames.image, classNames.checkImage),
        }}
      />
      <ImageIcon
        className={classNames.lock}
        imageProps={{
          src: TestImages.iconOne,
          className: css(classNames.image, classNames.lockImage),
        }}
      />
    </div>
  );
};
