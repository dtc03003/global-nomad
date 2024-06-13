import { useGetActivity } from '@/apis/apiHooks/temporary';
import { useRouter } from 'next/router';
import styles from './Activity.module.scss';
import classNames from 'classnames/bind';
import KebabBtn from '@/components/btns/KebabBtn/KebabBtn';
import StarIcon from '@/images/icon/icon_star_on.svg';
import LocationIcon from '@/images/icon/icon_location.svg';

const cn = classNames.bind(styles);

export default function Activity() {
  const router = useRouter();
  const { data } = useGetActivity({ activityId: router.query.activityId?.toString() ?? '' });

  return (
    <>
      <header className={cn('header')}>
        <div className={cn('header-contents')}>
          <div className={cn('tag')}>{data?.category}</div>
          <h2 className={cn('title')}>{data?.title}</h2>
          <div className={cn('footer')}>
            <span className={cn('rating')}>
              <StarIcon width={15} height={22} /> <span>({data?.reviewCount})</span>
            </span>
            <span className={cn('address')}>
              <LocationIcon height={18} />
              <span>{data?.address}</span>
            </span>
          </div>
        </div>
        <KebabBtn size={28} />
      </header>
    </>
  );
}
