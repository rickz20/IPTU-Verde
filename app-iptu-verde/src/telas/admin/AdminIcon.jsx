import DomicilioIcon from '../../../assets/Domicílio.svg';
import LocationIcon from '../../../assets/Vector 2.svg';
import ClockIcon from '../../../assets/clock-3.svg';
import TrashIcon from '../../../assets/trash-2.svg';
import InfoIcon from '../../../assets/alert-circle.svg';

const ICONS = {
  domicilio: DomicilioIcon,
  localizacao: LocationIcon,
  horario: ClockIcon,
  remover: TrashIcon,
  informacao: InfoIcon,
};

export default function AdminIcon({ name, size = 16 }) {
  const Icon = ICONS[name];
  return <Icon width={size} height={size} />;
}
